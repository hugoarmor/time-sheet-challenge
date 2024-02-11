import { TimePunch } from "@prisma/client";
import { ObjectSerializer } from "../services/object-serializer";
import { format } from "date-fns";

type Payload = {
  date: Date;
  dailyTimePunches: TimePunch[];
};

type Result = {
  dia: string;
  pontos: string[];
};

type Attributes = keyof Result;

export class PostBatidasSerializer extends ObjectSerializer<Payload, Result> {
  attributes: Attributes[] = ["dia", "pontos"];
  handlers = {
    dia: () => format(this.obj.date, "yyyy-MM-dd"),
    pontos: () =>
      this.obj.dailyTimePunches.map((punch) =>
        format(punch.moment, "HH:mm:ss")
      ),
  };
}
