import { endOfDay, startOfDay, subMinutes } from "date-fns";
import {
  CreateTimePunchPayload,
  OptionsGetDailyPunches,
  TimePunchServiceContract,
} from "./service.contract";
import { PrismaClient } from "@prisma/client";
import { TimePunchPolicy } from "./policy";
import { HttpError } from "../../errors/http-error";
import { inject, injectable, registry } from "tsyringe";

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

  public async getDailyPunches(day: Date, options: OptionsGetDailyPunches) {
    return this.databaseService.timePunch.findMany({
      where: {
        moment: {
          gte: startOfDay(day),
          lte: endOfDay(day),
        },
      },
      orderBy: options.orderBy && {
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
}
