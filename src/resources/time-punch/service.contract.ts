import { TimePunch } from "@prisma/client";

export interface TimePunchServiceContract {
  create(data: CreateTimePunchPayload): Promise<TimePunch>
  getOneFromHourAgo(moment: Date): Promise<TimePunch | null>
  getDailyPunches(day: Date, options: OptionsGetDailyPunches): Promise<TimePunch[]>
  getDailyPunchesCount(day: Date): Promise<number>
  findByMoment(moment: Date): Promise<TimePunch | null>
}

export type OptionsGetDailyPunches = {
  orderBy: "asc" | "desc"
}

export type CreateTimePunchPayload = {
  yearMonth: string
  moment: Date
}
