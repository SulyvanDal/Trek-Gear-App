import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { TokenExpiredError, TokenInvalidError } from "../lib/errors.ts";
import { config } from "../lib/config.ts";

interface ReadPayload extends JwtPayload {
  userId: number;
}

export function currentUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const secret = config.JWT_SECRET;
  let payload: ReadPayload;

  if (token === undefined) {
    throw new TokenInvalidError("Aucun token fourni");
  }

  try {
    payload = jwt.verify(token, secret) as ReadPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError("Token expiré");
    }
    throw new TokenInvalidError("Token invalide");
  }

  res.locals.userId = payload.userId;
  next();
}
