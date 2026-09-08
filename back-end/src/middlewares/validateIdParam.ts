import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../lib/errors.ts";

export function validateIdParam(paramName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const id = Number(req.params[paramName]);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError(`${paramName} doit être un entier`);
    }
    next();
  };
}
