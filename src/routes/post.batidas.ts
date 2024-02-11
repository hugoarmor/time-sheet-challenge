import { PrismaClient } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";
import { TimePunchService } from "../resources/time-punch/service";
import { HttpError } from "../errors/http-error";
import { TimePunchesController } from "../resources/time-punch/controller";
import { handleError } from "../middlewares/error-handler";

const router = Router();

type Payload = {
  momento: string;
};

const controller = new TimePunchesController(
  new TimePunchService(new PrismaClient())
);

router.post(
  "/v1/batidas",
  (req: Request<{}, {}, Payload>, res: Response, next: NextFunction) =>
    controller.create
      .bind(controller)(req, res)
      .catch((error) => {
        handleError(error as HttpError, req, res, next);
      })
);

export { router };
