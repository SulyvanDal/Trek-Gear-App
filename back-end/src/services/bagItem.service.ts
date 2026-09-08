import { prisma } from "../lib/prisma.ts";
import { getBagById } from "./bag.service.ts";
import type { AddBagItemInput, BagItemLine } from "../schema/bagItem.schema.ts";
import { getItemById } from "./item.service.ts";
import { ConflictError } from "../lib/errors.ts";
import { Prisma } from "@prisma/client";

export async function getBagItems(bagId: number) {
  //Check si l'id du bag existe, si ko, une erreur interrompre la séquence
  await getBagById(bagId);

  //Chercher les items lié à un bag.id
  const bagItems = await prisma.bagItem.findMany({
    where: { bagId },
    include: { item: true },
    orderBy: { item: { name: "asc" } },
  });

  const items: BagItemLine[] = [];
  let totalWeightGrams = 0;
  let requiredWeightGrams = 0;
  bagItems.forEach((row) => {
    const lineWeightGrams = row.item.weightGrams * row.bagQuantity;

    totalWeightGrams += lineWeightGrams;
    if (row.isRequired) {
      requiredWeightGrams += lineWeightGrams;
    }

    items.push({
      itemId: row.itemId,
      name: row.item.name,
      category: row.item.category,
      isRequired: row.isRequired,
      quantity: row.bagQuantity,
      weightGrams: row.item.weightGrams,
    });
  });

  const optionalWeightGrams = totalWeightGrams - requiredWeightGrams;
  return {
    items: items,
    totals: {
      totalWeightGrams: totalWeightGrams,
      requiredWeightGrams: requiredWeightGrams,
      optionalWeightGrams: optionalWeightGrams,
    },
  };
}
export async function addItemToBag(bagId: number, input: AddBagItemInput) {
  //Contrôle de l'existence des objects en BDD
  await getBagById(bagId);
  await getItemById(input.itemId);

  try {
    const bagItem = await prisma.bagItem.create({
      data: {
        bagId,
        itemId: input.itemId,
        bagQuantity: input.bagQuantity,
        isRequired: input.isRequired,
      },
      include: { item: true },
    });

    const item: BagItemLine = {
      itemId: bagItem.itemId,
      name: bagItem.item.name,
      category: bagItem.item.category,
      isRequired: bagItem.isRequired,
      quantity: bagItem.bagQuantity,
      weightGrams: bagItem.item.weightGrams,
    };

    return item;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ConflictError("Cet item est déjà dans ce sac");
    }
    throw err;
  }
}
