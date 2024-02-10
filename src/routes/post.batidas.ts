import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import * as date from "date-fns";
import { PostBatidasSerializer } from "../serializers/post_batidas";

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

  await db.timePunch.create({
    data: {
      yearMonth,
      moment: dateObject,
    },
  });

  const serialized = new PostBatidasSerializer({ momento }).serialize();

  res.json(serialized);
});

export { router };
