import { format } from "date-fns";
import { TimePunchService } from "./service";
import { HttpError } from "../../errors/http-error";

export class TimePunchPolicy {
  constructor(private readonly timePunchService: TimePunchService) {}

  FORBIDDEN_DAYS = ["saturday", "sunday"]

  async isLunchBreakMinimumReached(moment: Date) {
    const tooRecent = await this.timePunchService.getOneFromHourAgo(moment);

    if (tooRecent) {
      throw new HttpError("Deve haver no mínimo 1 hora de almoço", 400);
    }
  }

  async isNotWeekendDay(moment: Date){
    const day = format(moment, "EEEE").toLocaleLowerCase();

    if (this.FORBIDDEN_DAYS.includes(day)) {
      throw new HttpError("Sábado e domingo não são permitidos como dia de trabalho", 400);
    }
  }
}
