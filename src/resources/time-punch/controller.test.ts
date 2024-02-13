import "reflect-metadata";
import { TimePunchesController } from './controller';
import { HttpError } from '../../errors/http-error';

const mockTimePunchService = {
  create: jest.fn(),
  getDailyPunches: jest.fn(),
  getExpedientesByYearMonth: jest.fn(),
  getMonthlyDiagnose: jest.fn(),
};

const sampleRequest = {
  body: {
    momento: "2024-02-13T08:00:00",
  },
  params: {
    yearMonth: "2024-02",
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('TimePunchesController', () => {
  let timePunchesController: TimePunchesController;

  beforeEach(() => {
    jest.clearAllMocks();
    timePunchesController = new TimePunchesController(mockTimePunchService);
  });

  describe('create', () => {
    it('should create a new time punch and return an expediente', async () => {
      mockTimePunchService.create.mockResolvedValueOnce({});
      mockTimePunchService.getDailyPunches.mockResolvedValueOnce([]);

      await timePunchesController.create(sampleRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw an error for invalid date format', async () => {
      const invalidRequest = { ...sampleRequest, body: { momento: "invalid date" } };

      await expect(timePunchesController.create(invalidRequest as any, mockResponse as any))
        .rejects.toThrow(HttpError);
    });
  });

  describe('getRelatorioMensal', () => {
    it('should get monthly diagnosis and return relatorio', async () => {
      mockTimePunchService.getMonthlyDiagnose.mockResolvedValueOnce({});

      await timePunchesController.getRelatorioMensal(sampleRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw an error if yearMonth is not provided', async () => {
      const invalidRequest = { ...sampleRequest, params: {} };

      await expect(timePunchesController.getRelatorioMensal(invalidRequest as any, mockResponse as any))
        .rejects.toThrow(HttpError);
    });
  });
});
