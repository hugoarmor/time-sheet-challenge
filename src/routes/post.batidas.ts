import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import * as date from "date-fns";
import { TimePunchService } from "../resources/time-punch/service";
import { TimePunchPolicy } from "../resources/time-punch/policy";
import { PostBatidasSerializer } from "../serializers/post-batidas";
import { HttpError } from "../errors/http-error";

const router = Router();

type Payload = {
  momento: string;
};

router.post("/v1/batidas", async (req: Request, res: Response) => {
  const { momento } = req.body as Payload;

  if (!momento) {
    throw new HttpError("Campo obrigatório não informado", 400);
  }

  const prismaClient = new PrismaClient();
  const timePunchService = new TimePunchService(prismaClient);

  const dateObject = date.parseISO(momento);
  const yearMonth = date.format(dateObject, "yyyy-MM");

  await timePunchService.create({
    yearMonth,
    moment: dateObject,
  });

  const dailyTimePunches = await timePunchService.getDailyPunches(dateObject, {
    orderBy: "asc",
  });

  const serialized = new PostBatidasSerializer({
    date: dateObject,
    dailyTimePunches,
  }).serialize();

  res.json(serialized);
});

export { router };
