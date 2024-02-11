import {endOfDay, startOfDay, subHours, subMinutes} from "date-fns";
import { CreateTimePunchPayload, OptionsGetDailyPunches, TimePunchServiceContract } from "./service.contract";
import { PrismaClient } from "@prisma/client";
import { TimePunchPolicy } from "./policy";
import { HttpError } from "../../errors/http-error";

export class TimePunchService implements TimePunchServiceContract {
  policies: TimePunchPolicy;

  constructor(private readonly databaseService: PrismaClient, policies?: TimePunchPolicy) {
    this.policies = policies || new TimePunchPolicy(this);
  }

  private TIME_PUNCHES_DAILY_LIMIT = 4;

  public async create(data: CreateTimePunchPayload) {
    const existingPunch = await this.findByMoment(data.moment);

    if (existingPunch) {
      throw new HttpError("Ponto já registrado", 409);
    }

    await this.policies.isNotWeekendDay(data.moment);
    await this.policies.isLunchBreakMinimumReached(data.moment);

    const dailyPunchesCount = await this.getDailyPunchesCount(data.moment);

    if (dailyPunchesCount >= this.TIME_PUNCHES_DAILY_LIMIT) {
      throw new Error(`Já foram registrados ${this.TIME_PUNCHES_DAILY_LIMIT} pontos para este dia`);
    }

    return this.databaseService.timePunch.create({ data })
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
