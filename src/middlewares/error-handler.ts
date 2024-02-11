import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";

export function handleError(err: HttpError, _req: Request, res: Response, next: NextFunction) {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });

  next();
}
