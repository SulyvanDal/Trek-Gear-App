import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";
import type { CreateBagInput, UpdateBagInput } from "../schema/bag.schema.ts";

export function getAllBags() {
  return prisma.bag.findMany({ orderBy: { name: "asc" } });
}

export async function getBagById(id: number) {
  const bag = await prisma.bag.findUnique({ where: { id } });

  if (bag === null) {
    throw new NotFoundError("bag", id);
  }

  return bag;
}

export async function createBag(input: CreateBagInput) {
  try {
    return await prisma.bag.create({ data: input });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ConflictError("Un sac porte déjà ce nom");
    }
    throw err;
  }
}

export async function deleteBagById(id: number) {
  try {
    return await prisma.bag.delete({ where: { id } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new NotFoundError("bag", id);
    }
    throw err;
  }
}

export async function updateBagById(id: number, input: UpdateBagInput) {
  try {
    return await prisma.bag.update({ where: { id }, data: input });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2025":
          throw new NotFoundError("bag", id);
        case "P2002":
          throw new ConflictError("le nouveau nom existe déjà");
        default:
          break;
      }
    }
    throw err;
  }
}
