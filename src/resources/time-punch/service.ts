import {
  endOfDay,
  format,
  parseISO,
  startOfDay,
  subMinutes,
} from "date-fns";
import {
  CreateTimePunchPayload,
  OptionsGetDailyPunches,
  OptionsGetExpedientesByYearMonth,
  TimePunchServiceContract,
} from "./service.contract";
import { PrismaClient, TimePunch } from "@prisma/client";
import { TimePunchPolicy } from "./policy";
import { HttpError } from "../../errors/http-error";
import { inject, injectable } from "tsyringe";
import { ExpedienteSerializer } from "../../serializers/expediente";
import { DateService } from "../../services/date";

@injectable()
export class TimePunchService implements TimePunchServiceContract {
  constructor(
    @inject("PrismaClient") private readonly databaseService: PrismaClient,
    @inject("TimePunchPolicy") private readonly policies: TimePunchPolicy
  ) {}

  private TIME_PUNCHES_DAILY_LIMIT = 4;

  public async create(data: CreateTimePunchPayload) {
    const timePunchFromLessThanHourAgo = await this.getOneFromHourAgo(
      data.moment
    );

    await this.policies.isNotWeekendDay(data.moment);
    await this.policies.isLunchBreakMinimumReached(
      timePunchFromLessThanHourAgo?.moment
    );

    const existingPunch = await this.findByMoment(data.moment);

    if (existingPunch) {
      throw new HttpError("Ponto já registrado", 409);
    }

    const dailyPunchesCount = await this.getDailyPunchesCount(data.moment);

    if (dailyPunchesCount >= this.TIME_PUNCHES_DAILY_LIMIT) {
      throw new Error(
        `Já foram registrados ${this.TIME_PUNCHES_DAILY_LIMIT} pontos para este dia`
      );
    }

    return this.databaseService.timePunch.create({ data });
  }

  public async getOneFromHourAgo(moment: Date) {
    return this.databaseService.timePunch.findFirst({
      where: {
        moment: {
          gte: subMinutes(moment, 59),
          lte: moment,
        },
      },
    });
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

  public async getDailyPunchesCount(day: Date) {
    return this.databaseService.timePunch.count({
      where: {
        moment: {
          gte: startOfDay(day),
          lte: endOfDay(day),
        },
      },
    });
  }

  public async findByMoment(moment: Date) {
    return this.databaseService.timePunch.findFirst({
      where: {
        moment,
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
      anoMes: yearMonth,
      secondsWorked,
      secondsExceeded,
      secondsInDebt,
      expedientes,
    };
  }
}
