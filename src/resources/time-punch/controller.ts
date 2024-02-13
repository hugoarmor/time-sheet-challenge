import { Request, Response } from "express";
import { HttpError } from "../../errors/http-error";
import { TimePunchServiceContract } from "./service.contract";
import { format, parseISO } from "date-fns";
import { ExpedienteSerializer } from "../../serializers/expediente";
import { inject, injectable } from "tsyringe";
import { Get, Post } from "../../services/routing";
import { RelatorioMensalSerializer } from "../../serializers/relatorio-mensal";

@injectable()
export class TimePunchesController {
  constructor(
    @inject("TimePunchService")
    private readonly timePunchService: TimePunchServiceContract
  ) {}

  @Post("/v1/batidas")
  async create(req: Request, res: Response) {
    const { momento } = req.body as { momento: string };

    if (!momento) {
      throw new HttpError("Campo obrigatório não informado", 400);
    }

    const dateObject = parseISO(momento);
    const yearMonth = format(dateObject, "yyyy-MM");

    await this.timePunchService.create({
      yearMonth,
      moment: dateObject,
    });

    const dailyTimePunches = await this.timePunchService.getDailyPunches(
      dateObject,
      {
        orderBy: "asc",
      }
    );

    const expediente = new ExpedienteSerializer({
      date: dateObject,
      dailyTimePunches,
    }).serialize();

    res.status(201).json(expediente);
  }

  @Get("/v1/folhas-de-ponto/:yearMonth")
  async getRelatorioMensal(req: Request, res: Response) {
    const { yearMonth } = req.params;

    if (!yearMonth) {
      throw new HttpError("Campo obrigatório não informado", 400);
    }

    const monthlyDiagnose = await this.timePunchService.getMonthlyDiagnose(
      yearMonth
    );

    const relatorio = new RelatorioMensalSerializer(
      monthlyDiagnose
    ).serialize();

    res.status(200).json(relatorio);
  }
}
