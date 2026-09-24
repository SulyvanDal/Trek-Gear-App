import type { NextFunction, Request, Response } from "express";
import {
  register as registerUser,
  login as loginUser,
} from "../services/auth.service.ts";
import type { LoginInput, RegisterInput } from "../schema/auth.schema.ts";

export async function register(req: Request, res: Response) {
  const input = req.body as RegisterInput;
  const resultToken = await registerUser(input);

  res.status(201).json({ data: resultToken });
}

export async function login(req: Request, res: Response) {
  const input = req.body as LoginInput;
  const resultToken = await loginUser(input);

  res.status(200).json({ data: resultToken });
}
