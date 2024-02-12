import { TimePunch } from "@prisma/client";
import * as ExpedienteSerializerModule from "../../serializers/expediente";

export interface TimePunchServiceContract {
  create(data: CreateTimePunchPayload): Promise<TimePunch>
  getOneFromHourAgo(moment: Date): Promise<TimePunch | null>
  getDailyPunches(day: Date, options?: OptionsGetDailyPunches): Promise<TimePunch[]>
  getDailyPunchesCount(day: Date): Promise<number>
  findByMoment(moment: Date): Promise<TimePunch | null>
  getExpedientesByYearMonth(yearMonth: string, options?: OptionsGetExpedientesByYearMonth): Promise<ExpedienteSerializerModule.Result[]>
  getMonthlyDiagnose(yearMonth: string): Promise<any>
}

export type OptionsGetDailyPunches = {
  orderBy: "asc" | "desc"
}

export type OptionsGetExpedientesByYearMonth = {
  orderBy: "asc" | "desc"
}

export type CreateTimePunchPayload = {
  yearMonth: string
  moment: Date
}
