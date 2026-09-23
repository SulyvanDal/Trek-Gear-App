import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";
import type { CreateBagInput, UpdateBagInput } from "../schema/bag.schema.ts";
import { computeWeightTotals, type WeightLine } from "../lib/weight.ts";

export async function getAllBags(userId: number) {
  const bags = await prisma.bag.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
    include: { bagItem: { include: { item: true } } },
  });

  return bags.map((bag) => {
    let weightLines: WeightLine[] = [];
    bag.bagItem.forEach((itemLines) => {
      weightLines.push({
        weightGrams: itemLines.item.weightGrams,
        quantity: itemLines.bagQuantity,
        isRequired: itemLines.isRequired,
      });
    });
    let totals = computeWeightTotals(weightLines);
    return {
      id: bag.id,
      name: bag.name,
      totals: totals,
      createdAt: bag.createdAt,
      updatedAt: bag.updatedAt,
    };
  });
}

export async function getBagById(userId: number, id: number) {
  const bag = await prisma.bag.findUnique({ where: { id, ownerId: userId } });

  if (bag === null) {
    throw new NotFoundError("bag", id);
  }

  return bag;
}

export async function createBag(userId: number, input: CreateBagInput) {
  try {
    return await prisma.bag.create({ data: { ...input, ownerId: userId } });
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

export async function deleteBagById(userId: number, id: number) {
  try {
    return await prisma.bag.delete({ where: { id, ownerId: userId } });
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

export async function updateBagById(
  userId: number,
  id: number,
  input: UpdateBagInput,
) {
  try {
    return await prisma.bag.update({
      where: { id, ownerId: userId },
      data: input,
    });
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
