import { ObjectSerializer } from "../services/object-serializer";
import * as ExpedienteSerializerModule from "./expediente";
import { DateService } from "../services/date";
import { MonthlyDiagnose } from "../resources/time-punch/service.contract";

type Payload = MonthlyDiagnose;

type Result = {
  anoMes: string;
  horasTrabalhadas: string;
  horasExcedentes: string;
  horasDevidas: string;
  expedientes: ExpedienteSerializerModule.Result[];
};

type Attributes = keyof Result;

export class RelatorioMensalSerializer extends ObjectSerializer<Payload, Result> {
  attributes: Attributes[] = [
    "anoMes",
    "horasTrabalhadas",
    "horasExcedentes",
    "horasDevidas",
    "expedientes",
  ];
  handlers = {
    anoMes: () => this.obj.yearMonth,
    horasTrabalhadas: () =>
      DateService.formatDurationToISO8601(
        DateService.formatSecondsToDuration(this.obj.secondsWorked)
      ),
    horasExcedentes: () =>
      DateService.formatDurationToISO8601(
        DateService.formatSecondsToDuration(
          this.obj.secondsExceeded > 0 ? this.obj.secondsExceeded : 0
        )
      ),
    horasDevidas: () =>
      DateService.formatDurationToISO8601(
        DateService.formatSecondsToDuration(
          this.obj.secondsInDebt > 0 ? this.obj.secondsInDebt : 0
        )
      )
  };
}
