import { ExpedienteSerializer } from "./expediente";
import { TimePunch } from "@prisma/client";
import { format } from "date-fns";

const sampleTimePunches: TimePunch[] = [
  { id: "1", yearMonth: '2024-02', moment: new Date('2024-02-13T08:00:00') },
  { id: "2", yearMonth: '2024-02', moment: new Date('2024-02-13T12:00:00') },
];

const payload: { date: Date; dailyTimePunches: TimePunch[] } = {
  date: new Date('2024-02-13T00:00:00'),
  dailyTimePunches: sampleTimePunches,
};

describe('ExpedienteSerializer', () => {
  let serializer: ExpedienteSerializer;

  beforeEach(() => {
    serializer = new ExpedienteSerializer(payload);
  });

  it('should serialize the payload correctly', () => {
    const expectedDia = format(payload.date, "yyyy-MM-dd");
    const expectedPontos = payload.dailyTimePunches.map(punch => format(punch.moment, "HH:mm:ss"));

    const serialized = serializer.serialize();

    expect(serialized.dia).toBe(expectedDia);
    expect(serialized.pontos).toEqual(expectedPontos);
  });

  it('should have correct attributes and handlers', () => {
    expect(serializer.attributes).toEqual(["dia", "pontos"]);

    expect(serializer.handlers).toEqual({
      dia: expect.any(Function),
      pontos: expect.any(Function),
    });
  });

  it('should format the date correctly', () => {
    const formattedDate = serializer.handlers.dia();

    expect(formattedDate).toBe(format(payload.date, "yyyy-MM-dd"));
  });

  it('should format time punches correctly', () => {
    const formattedTimePunches = serializer.handlers.pontos();

    const expectedFormattedTimePunches = payload.dailyTimePunches.map(punch =>
      format(punch.moment, "HH:mm:ss")
    );

    expect(formattedTimePunches).toEqual(expectedFormattedTimePunches);
  });
});
