import { format } from "date-fns";
import { HttpError } from "../../errors/http-error";
import { injectable } from "tsyringe";

@injectable()
export class TimePunchPolicy {
  FORBIDDEN_DAYS = ["saturday", "sunday"]

  async isLunchBreakMinimumReached(timePunchFromLessThanHourAgo?: Date) {
    if (!!timePunchFromLessThanHourAgo) {
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
