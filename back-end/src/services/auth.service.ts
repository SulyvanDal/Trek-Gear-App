import argon2 from "argon2";
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "@prisma/client";
import { ConflictError, InvalidCredentialsError } from "../lib/errors.ts";
import jwt from "jsonwebtoken";
import { config } from "../lib/config.ts";
import type { LoginInput, RegisterInput } from "../schema/auth.schema.ts";

export async function register(input: RegisterInput) {
  const passwordHash = await argon2.hash(input.password);
  try {
    const user = await prisma.user.create({
      data: { email: input.email, passwordHash: passwordHash },
    });
    return jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ConflictError("Email déjà existant");
    }
    throw err;
  }
}

export async function login(input: LoginInput) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new InvalidCredentialsError("Email ou mot de passe incorrect");
    }

    const loginSuccess = await argon2.verify(user.passwordHash, input.password);
    if (loginSuccess) {
      return jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });
    }

    throw new InvalidCredentialsError("Email ou mot de passe incorrect");
  } catch (err) {
    throw err;
  }
}
