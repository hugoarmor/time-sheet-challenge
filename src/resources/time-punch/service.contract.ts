import { TimePunch } from "@prisma/client";
import * as ExpedienteSerializerModule from "../../serializers/expediente";

export interface TimePunchServiceContract {
  create(data: CreateTimePunchPayload): Promise<TimePunch>;
  getDailyPunches(
    day: Date,
    options?: OptionsGetDailyPunches
  ): Promise<TimePunch[]>;
  getExpedientesByYearMonth(
    yearMonth: string,
    options?: OptionsGetExpedientesByYearMonth
  ): Promise<ExpedienteSerializerModule.Result[]>;
  getMonthlyDiagnose(yearMonth: string): Promise<MonthlyDiagnose>;
}

export type OptionsGetDailyPunches = {
  orderBy: "asc" | "desc";
};

export type OptionsGetExpedientesByYearMonth = {
  orderBy: "asc" | "desc";
};

export type CreateTimePunchPayload = {
  yearMonth: string;
  moment: Date;
};

export type MonthlyDiagnose = {
  yearMonth: string;
  secondsWorked: number;
  secondsExceeded: number;
  secondsInDebt: number;
  expedientes: ExpedienteSerializerModule.Result[];
};
