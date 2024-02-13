import {
  differenceInHours,
  differenceInSeconds,
  eachDayOfInterval,
  format,
  isWeekend,
  parse,
  parseISO,
} from "date-fns";

export class DateService {
  public static countWeekdaysInMonth(year: number, month: number) {
    const datesOfMonth = eachDayOfInterval({
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0),
    });

    const weekdaysCount = datesOfMonth.filter(
      (date) => !isWeekend(date)
    ).length;

    return weekdaysCount;
  }

  public static subtractTimesToHours(time1: string, time2: string) {
    const date1 = parse(time1, "HH:mm:ss", new Date());
    const date2 = parse(time2, "HH:mm:ss", new Date());

    const difference = differenceInHours(date2, date1);
    console.log(difference);

    return difference;
  }

  public static getTotalSecondsWorked(timePunches: string[]): number {
    let totalMinutes = 0;

    const dates = timePunches.map((time) =>
      parse(time, "HH:mm:ss", new Date())
    );

    for (let i = 0; i < dates.length - 1; i++) {
      const isLunchTime = i === 1;

      if (isLunchTime) {
        continue;
      }

      const durationMinutes = differenceInSeconds(dates[i + 1], dates[i]);

      totalMinutes += durationMinutes;
    }

    const totalSecondsWorked = totalMinutes;

    return totalSecondsWorked;
  }

  public static formatDurationToISO8601({ hours, minutes, seconds }: Duration) {
    const formattedHours = hours ? `${hours}H` : "";
    const formattedMinutes = minutes ? `${minutes}M` : hours ? "0M" : "";
    const formattedSeconds = seconds ? `${seconds}S` : "0S";

    return `PT${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }

  public static formatSecondsToDuration(seconds: number): Duration {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    return { hours, minutes, seconds: newSeconds };
  }

  public static isValidISO(dateString: string) {
    try {
      const parsedDate = parseISO(dateString);
      const formatted = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");

      return formatted === dateString;
    } catch(error) {
      return false;
    }
  }
}

type Duration = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};
