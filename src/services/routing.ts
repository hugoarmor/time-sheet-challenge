import { Router } from "express";
import { container } from "tsyringe";
import { handleError } from "../middlewares/error-handler";
import { HttpError } from "../errors/http-error";

export type HttpRoute = {
  path: string;
  handler: string;
  method: "get" | "post";
  controller: string;
};

export let httpRoutes: HttpRoute[] = [];

export function Get(path: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    httpRoutes.push({
      path,
      handler: key,
      method: "get",
      controller: target.constructor.name,
    });

    return descriptor;
  };
}

export function Post(path: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    httpRoutes.push({
      path,
      handler: key,
      method: "post",
      controller: target.constructor.name,
    });

    return descriptor;
  };
}

export function buildRoutes(httpRoutes: HttpRoute[]) {
  const router = Router();

  for (const handler of httpRoutes) {
    const controller: any = container.resolve(handler.controller);

    router[handler.method](handler.path, (req, res, next) =>
      controller[handler.handler].call(controller, req, res).catch(
        (error: unknown) => {
          handleError(error as HttpError, req, res, next);
        }
      )
    );
  }

  return router;
}
