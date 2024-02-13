import { TimePunchPolicy } from "./policy";
import { HttpError } from "../../errors/http-error";
import { addHours, addMinutes, parseISO } from "date-fns";

describe('TimePunchPolicy', () => {
  describe('isLunchBreakMinimumReached', () => {
    it('should not throw error when lunch break minimum is reached', () => {
      const moments = [
        new Date(),
        addHours(new Date(), 4),
        addHours(new Date(), 5),
      ];

      expect(() => TimePunchPolicy.isLunchBreakMinimumReached(moments)).not.toThrow();
    });

    it('should throw error when lunch break minimum is not reached', () => {
      const moments = [
        new Date(),
        addMinutes(new Date(), 30),
        addHours(new Date(), 1),
      ];

      expect(() => TimePunchPolicy.isLunchBreakMinimumReached(moments)).toThrow(HttpError);
    });
  });

  describe('isNotWeekendDay', () => {
    it('should not throw error for a weekday', () => {
      const weekday = parseISO('2024-01-05');

      expect(() => TimePunchPolicy.isNotWeekendDay(weekday)).not.toThrow();
    });

    it('should throw error for Saturday', () => {
      const saturday = parseISO('2024-01-06');

      expect(() => TimePunchPolicy.isNotWeekendDay(saturday)).toThrow(HttpError);
    });

    it('should throw error for Sunday', () => {
      const sunday = parseISO('2024-01-07');

      expect(() => TimePunchPolicy.isNotWeekendDay(sunday)).toThrow(HttpError);
    });
  });
});
