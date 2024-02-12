import { Request, Response } from "express";
import { HttpError } from "../../errors/http-error";
import { TimePunchServiceContract } from "./service.contract";
import { format, parseISO } from "date-fns";
import { PostBatidasSerializer } from "../../serializers/post-batidas";
import { inject, injectable } from "tsyringe";
import { Post } from "../../services/routing";

@injectable()
export class TimePunchesController {
  constructor(@inject("TimePunchService") private readonly timePunchService: TimePunchServiceContract) {}

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

    const dailyTimePunches = await this.timePunchService.getDailyPunches(dateObject, {
      orderBy: "asc",
    });

    const serialized = new PostBatidasSerializer({
      date: dateObject,
      dailyTimePunches,
    }).serialize();

    res.json(serialized);
  }
}
