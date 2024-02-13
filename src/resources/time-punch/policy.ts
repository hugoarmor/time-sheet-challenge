import { differenceInMinutes, format } from "date-fns";
import { HttpError } from "../../errors/http-error";
import { injectable } from "tsyringe";

@injectable()
export class TimePunchPolicy {
  static FORBIDDEN_DAYS = ["saturday", "sunday"];
  static LUNCH_BREAK_MINIMUM_MINUTES = 60;
  static TIME_PUNCHES_DAILY_LIMIT = 4;

  static isLunchBreakMinimumReached(moments: Date[]) {
    if (moments.length < 2) {
      return;
    }

    moments.sort((a, b) => a.getTime() - b.getTime());

    const lunchBreak = Math.abs(
      differenceInMinutes(
        moments[2],
        moments[1]
      )
    );

    if (lunchBreak < TimePunchPolicy.LUNCH_BREAK_MINIMUM_MINUTES) {
      throw new HttpError("Deve haver no mínimo 1 hora de almoço", 400);
    }
  }

  static isNotWeekendDay(moment: Date) {
    const day = format(moment, "EEEE").toLocaleLowerCase();

    if (TimePunchPolicy.FORBIDDEN_DAYS.includes(day)) {
      throw new HttpError(
        "Sábado e domingo não são permitidos como dia de trabalho",
        400
      );
    }
  }
}
