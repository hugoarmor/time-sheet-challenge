import { TimePunch } from "@prisma/client";
import { ObjectSerializer } from "../services/object-serializer";
import { format } from "date-fns";
import * as ExpedienteSerializerModule from "./expediente";
import { DateService } from "../services/date";

type Payload = {
  anoMes: string;
  secondsWorked: number;
  secondsExceeded: number;
  secondsInDebt: number;
  expedientes: ExpedienteSerializerModule.Result[];
};

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
