import { RelatorioMensalSerializer } from "./relatorio-mensal";
import { MonthlyDiagnose } from "../resources/time-punch/service.contract";
import { DateService } from "../services/date";

// Mock MonthlyDiagnose data
const sampleMonthlyDiagnose: MonthlyDiagnose = {
  yearMonth: '2024-02',
  secondsWorked: 36000,
  secondsExceeded: 1800,
  secondsInDebt: 1800,
  expedientes: [
    { dia: '2024-02-01', pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'] }
  ],
};

describe('RelatorioMensalSerializer', () => {
  let serializer: RelatorioMensalSerializer;

  beforeEach(() => {
    serializer = new RelatorioMensalSerializer(sampleMonthlyDiagnose);
  });

  it('should serialize the monthly diagnose correctly', () => {
    const expectedAnoMes = sampleMonthlyDiagnose.yearMonth;
    const expectedHorasTrabalhadas = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsWorked)
    );
    const expectedHorasExcedentes = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsExceeded)
    );
    const expectedHorasDevidas = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsInDebt)
    );

    const serialized = serializer.serialize();

    expect(serialized.anoMes).toBe(expectedAnoMes);
    expect(serialized.horasTrabalhadas).toBe(expectedHorasTrabalhadas);
    expect(serialized.horasExcedentes).toBe(expectedHorasExcedentes);
    expect(serialized.horasDevidas).toBe(expectedHorasDevidas);
    expect(serialized.expedientes).toEqual(sampleMonthlyDiagnose.expedientes);
  });

  it('should have correct attributes and handlers', () => {
    expect(serializer.attributes).toEqual([
      "anoMes",
      "horasTrabalhadas",
      "horasExcedentes",
      "horasDevidas",
      "expedientes",
    ]);

    expect(serializer.handlers).toEqual({
      anoMes: expect.any(Function),
      horasTrabalhadas: expect.any(Function),
      horasExcedentes: expect.any(Function),
      horasDevidas: expect.any(Function),
    });
  });

  it('should format the yearMonth correctly', () => {
    const formattedYearMonth = serializer.handlers.anoMes();
    expect(formattedYearMonth).toBe(sampleMonthlyDiagnose.yearMonth);
  });

  it('should format the worked hours correctly', () => {
    const formattedWorkedHours = serializer.handlers.horasTrabalhadas();
    const expectedFormattedWorkedHours = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsWorked)
    );
    expect(formattedWorkedHours).toBe(expectedFormattedWorkedHours);
  });

  it('should format the exceeded hours correctly', () => {
    const formattedExceededHours = serializer.handlers.horasExcedentes();
    const expectedFormattedExceededHours = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsExceeded)
    );
    expect(formattedExceededHours).toBe(expectedFormattedExceededHours);
  });

  it('should format the debt hours correctly', () => {
    const formattedDebtHours = serializer.handlers.horasDevidas();
    const expectedFormattedDebtHours = DateService.formatDurationToISO8601(
      DateService.formatSecondsToDuration(sampleMonthlyDiagnose.secondsInDebt)
    );
    expect(formattedDebtHours).toBe(expectedFormattedDebtHours);
  });
});
