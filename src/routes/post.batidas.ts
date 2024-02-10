import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import * as date from "date-fns";
import { PostBatidasSerializer } from "../serializers/post-batidas";

const router = Router();

type Payload = {
  momento: string;
};

router.post("/v1/batidas", async (req: Request, res: Response) => {
  const { momento } = req.body as Payload;

  if (!momento) {
    return res.json({
      mensagem: "Variável 'momento' não está presente",
    });
  }

  const db = new PrismaClient();

  const dateObject = date.parseISO(momento);
  const yearMonth = date.format(dateObject, "yyyy-MM");

  const existingPunch = await db.timePunch.findFirst({
    where: {
      moment: dateObject,
    },
  });

  if(!!existingPunch) {
    return res.status(409).json({
      mensagem: "Ponto já registrado",
    });
  }

  const hasOneHourDifference = await db.timePunch.findFirst({
    where: {
      moment: {
        gte: date.subHours(dateObject, 1),
        lte: dateObject,
      },
    },
  });

  if(!!hasOneHourDifference) {
    return res.status(400).json({
      mensagem: "Deve haver no mínimo 1 hora de almoço",
    });
  }

  await db.timePunch.create({
    data: {
      yearMonth,
      moment: dateObject,
    },
  });

  const momentDayPunches = await db.timePunch.findMany({
    where: {
      moment: {
        gte: date.startOfDay(dateObject),
        lte: date.endOfDay(dateObject),
      },
    },
    orderBy: {
      moment: "asc",
    },
  });

  const pontos = momentDayPunches.map((punch) =>
    date.format(punch.moment, "HH:mm:ss")
  );

  res.json({
    dia: date.format(dateObject, "yyyy-MM-dd"),
    pontos,
  });
});

export { router };
