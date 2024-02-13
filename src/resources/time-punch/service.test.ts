import "reflect-metadata";
import { TimePunchService } from './service';
import { TimePunch } from '@prisma/client';
import { HttpError } from '../../errors/http-error';

const prismaClientMock = {
  timePunch: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
} as any;

const sampleTimePunch: TimePunch = {
  id: "1",
  yearMonth: '2024-02',
  moment: new Date('2024-02-13T08:00:00'),
};

describe('TimePunchService', () => {
  let mockTimePunchService: TimePunchService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTimePunchService = new TimePunchService(prismaClientMock);
  });

  describe('create', () => {
    it('should create a new time punch', async () => {
      prismaClientMock.timePunch.create.mockResolvedValue(sampleTimePunch);
      mockTimePunchService.getDailyPunches = jest.fn().mockResolvedValue([]);

      const result = await mockTimePunchService.create({ yearMonth: '2024-02', moment: new Date() });

      expect(result).toEqual(sampleTimePunch);
    });

    it('should throw an error if the punch already exists', async () => {
      prismaClientMock.timePunch.findFirst.mockResolvedValue(sampleTimePunch);
      mockTimePunchService.getDailyPunches = jest.fn().mockResolvedValue([]);

      await expect(mockTimePunchService.create({ yearMonth: '2024-02', moment: new Date() }))
        .rejects.toThrow(HttpError);
    });
  });

  describe('getDailyPunches', () => {
    it('should return daily punches for a given day', async () => {
      const date = new Date('2024-02-13');
      prismaClientMock.timePunch.findMany.mockResolvedValue([sampleTimePunch]);

      const result = await mockTimePunchService.getDailyPunches(date);

      expect(result).toEqual([sampleTimePunch]);
    });
  });

  describe('getExpedientesByYearMonth', () => {
    it('should return expedientes for a given year and month', async () => {
      prismaClientMock.timePunch.findMany.mockResolvedValue([sampleTimePunch]);

      const result = await mockTimePunchService.getExpedientesByYearMonth('2024-02');

      expect(result.length).toBe(1);
    });
  });

  describe('getMonthlyDiagnose', () => {
    it('should return monthly diagnose with correct data', async () => {
      const yearMonth = '2024-02';

      const expectedExpediente = {
        dia: '2024-02-01',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'], // Sample time punch moments
      };

      mockTimePunchService.getExpedientesByYearMonth = jest.fn().mockResolvedValue([expectedExpediente]);

      const result = await mockTimePunchService.getMonthlyDiagnose(yearMonth);

      expect(typeof result.yearMonth).toEqual('string');
      expect(typeof result.secondsWorked).toEqual('number');
      expect(typeof result.secondsExceeded).toEqual('number');
      expect(typeof result.secondsInDebt).toEqual('number');
      expect(Array.isArray(result.expedientes)).toBe(true);
    });

  });
});
