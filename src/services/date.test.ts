import { DateService } from "./date";

describe("DateService", () => {
  describe('countWeekdaysInMonth', () => {
    it('should return the correct number of weekdays in a month', () => {
      const year = 2024;
      const month = 2;

      const weekdaysCount = DateService.countWeekdaysInMonth(year, month);

      expect(weekdaysCount).toBe(21);
    });
  });

  describe('subtractTimesToHours', () => {
    it('should return the difference in hours between two times', () => {
      const time1 = '12:00:00';
      const time2 = '15:30:00';

      const difference = DateService.subtractTimesToHours(time1, time2);

      expect(difference).toBe(3);
    });
  });

  describe("getTotalSecondsWorked", () => {
    it("should return the total seconds worked based on time punches", () => {
      const timePunches = ["08:00:00", "12:00:00", "13:00:00", "17:00:00"];

      const totalSecondsWorked = DateService.getTotalSecondsWorked(timePunches);

      expect(totalSecondsWorked).toBe(28800);
    });
  });

  describe("formatDurationToISO8601", () => {
    it("should format duration to ISO 8601 format", () => {
      const duration = { hours: 2, minutes: 30, seconds: 15 };

      const formattedDuration = DateService.formatDurationToISO8601(duration);

      expect(formattedDuration).toBe("PT2H30M15S");
    });
  });

  describe("formatSecondsToDuration", () => {
    it("should format seconds to duration", () => {
      const seconds = 9630;

      const formattedDuration = DateService.formatSecondsToDuration(seconds);

      expect(formattedDuration).toEqual({ hours: 2, minutes: 40, seconds: 30 });
    });
  });

  describe('isValidISO', () => {
    it('should return true for a valid ISO date string', () => {
      const validDateString = '2024-02-13T12:00:00';

      const isValid = DateService.isValidISO(validDateString);

      expect(isValid).toBe(true);
    });

    it('should throw an error for an invalid ISO date string', () => {
      const invalidDateString = '2024/02/13 12:00:00';

      const isValid = DateService.isValidISO(invalidDateString);

      expect(isValid).toBe(false);
    });
  });
});
