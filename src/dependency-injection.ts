import { container } from "tsyringe";
import { TimePunchService } from "./resources/time-punch/service";
import { PrismaClient } from "@prisma/client";
import { TimePunchesController } from "./resources/time-punch/controller";
import { TimePunchPolicy } from "./resources/time-punch/policy";

(() => {
  container.register("TimePunchService", {
    useClass: TimePunchService,
  });
  container.register("TimePunchesController", {
    useClass: TimePunchesController,
  });
  container.register("PrismaClient", {
    useValue: new PrismaClient(),
  });
  container.register("TimePunchPolicy", {
    useClass: TimePunchPolicy,
  });
})()
