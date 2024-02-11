import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";

export function errorHandler(err: HttpError, req: Request, res: Response, _: NextFunction) {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
}
