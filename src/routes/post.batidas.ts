import { Router, Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";
import { TimePunchesController } from "../resources/time-punch/controller";
import { handleError } from "../middlewares/error-handler";
import { container } from "tsyringe";

const router = Router();

type Payload = {
  momento: string;
};

const controller = container.resolve<TimePunchesController>("TimePunchesController");

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
