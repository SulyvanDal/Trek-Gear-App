import { Prisma } from "@prisma/client";
import { NotFoundError } from "../lib/errors.ts";
import { prisma } from "../lib/prisma.ts";
import type {
  CreateItemInput,
  UpdateItemInput,
} from "../schema/item.schema.ts";

export async function getItemById(userId: number, id: number) {
  const item = await prisma.item.findUnique({ where: { ownerId: userId, id } });

  if (item === null) throw new NotFoundError("item", id);

  return item;
}

export function getAllItems(userId: number) {
  return prisma.item.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
  });
}

export function createItem(userId: number, input: CreateItemInput) {
  return prisma.item.create({ data: { ...input, ownerId: userId } });
}

export async function deleteItemById(userId: number, id: number) {
  try {
    await prisma.item.delete({ where: { ownerId: userId, id } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new NotFoundError("item", id);
    }
    throw err;
  }
}

export async function updateItemById(
  userId: number,
  id: number,
  input: UpdateItemInput,
) {
  try {
    return await prisma.item.update({
      where: { ownerId: userId, id },
      data: input,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new NotFoundError("item", id);
    }
    throw err;
  }
}
