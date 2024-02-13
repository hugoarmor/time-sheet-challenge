import { endOfDay, format, parseISO, startOfDay, subMinutes } from "date-fns";
import {
  CreateTimePunchPayload,
  OptionsGetDailyPunches,
  OptionsGetExpedientesByYearMonth,
  TimePunchServiceContract,
} from "./service.contract";
import { Prisma, PrismaClient, TimePunch } from "@prisma/client";
import { TimePunchPolicy } from "./policy";
import { HttpError } from "../../errors/http-error";
import { inject, injectable } from "tsyringe";
import { ExpedienteSerializer } from "../../serializers/expediente";
import { DateService } from "../../services/date";

@injectable()
export class TimePunchService implements TimePunchServiceContract {
  constructor(
    @inject("PrismaClient") private readonly databaseService: PrismaClient
  ) {}

  public async create(data: CreateTimePunchPayload) {
    const dailyPunches = await this.getDailyPunches(data.moment, {
      orderBy: "asc",
    });

    const newMoments = dailyPunches.map((d) => d.moment).concat(data.moment);

    const existingPunch = await this.findOne({
      moment: data.moment,
    });

    if (existingPunch) {
      throw new HttpError("Ponto já registrado", 409);
    }

    TimePunchPolicy.isNotWeekendDay(data.moment);
    TimePunchPolicy.isLunchBreakMinimumReached(newMoments);

    if (dailyPunches.length >= TimePunchPolicy.TIME_PUNCHES_DAILY_LIMIT) {
      throw new Error(
        `Já foram registrados ${TimePunchPolicy.TIME_PUNCHES_DAILY_LIMIT} pontos para este dia`
      );
    }

    return this.databaseService.timePunch.create({ data });
  }

  public async findOne(where: Prisma.TimePunchWhereInput) {
    return this.databaseService.timePunch.findFirst({ where });
  }

  public async getDailyPunches(day: Date, options?: OptionsGetDailyPunches) {
    return this.databaseService.timePunch.findMany({
      where: {
        moment: {
          gte: startOfDay(day),
          lte: endOfDay(day),
        },
      },
      orderBy: options?.orderBy && {
        moment: options.orderBy,
      },
    });
  }

  public async getExpedientesByYearMonth(
    yearMonth: string,
    options?: OptionsGetExpedientesByYearMonth
  ) {
    const timePunches = await this.databaseService.timePunch.findMany({
      where: {
        yearMonth: yearMonth,
      },
      orderBy: options?.orderBy && {
        moment: options.orderBy,
      },
    });

    const dailyPunches = new Map<string, TimePunch[]>();

    for (const punch of timePunches) {
      const date = format(punch.moment, "yyyy-MM-dd");

      const existingDailyPunches = dailyPunches.get(date) ?? [];

      dailyPunches.set(date, [...existingDailyPunches, punch]);
    }

    const result = Array.from(dailyPunches).map(([date, punches]) =>
      new ExpedienteSerializer({
        dailyTimePunches: punches,
        date: parseISO(date),
      }).serialize()
    );

    return result;
  }

  public async getMonthlyDiagnose(yearMonth: string) {
    const existingTimePunch = await this.findOne({ yearMonth });

    if (!existingTimePunch) {
      throw new HttpError("Relatório não encontrado", 404);
    }

    const [year, month] = yearMonth.split("-").map(Number);

    const weekdaysCount = DateService.countWeekdaysInMonth(year, month);

    const requiredWorkSeconds = weekdaysCount * 8 * 3600;

    const expedientes = await this.getExpedientesByYearMonth(yearMonth, {
      orderBy: "asc",
    });

    let secondsWorked = 0;

    for (const expediente of expedientes) {
      const dailyPunches = expediente.pontos;

      secondsWorked += DateService.getTotalSecondsWorked(dailyPunches);
    }

    const secondsExceeded = secondsWorked - requiredWorkSeconds;
    const secondsInDebt = requiredWorkSeconds - secondsWorked;

    return {
      yearMonth,
      secondsWorked,
      secondsExceeded,
      secondsInDebt,
      expedientes,
    };
  }
}
