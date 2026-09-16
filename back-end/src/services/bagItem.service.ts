import { prisma } from "../lib/prisma.ts";
import { getBagById } from "./bag.service.ts";
import type { AddBagItemInput, BagItemLine } from "../schema/bagItem.schema.ts";
import { getItemById } from "./item.service.ts";
import { ConflictError } from "../lib/errors.ts";
import { Prisma } from "@prisma/client";
import { computeWeightTotals } from "../lib/weight.ts";

export async function getBagItems(bagId: number) {
  //Check si l'id du bag existe, si ko, une erreur interrompre la séquence
  const bag = await getBagById(bagId);

  //Chercher les items lié à un bag.id
  const bagItems = await prisma.bagItem.findMany({
    where: { bagId },
    include: { item: true },
    orderBy: [{ item: { category: "asc" } }, { item: { name: "asc" } }],
  });

  const items: BagItemLine[] = [];
  bagItems.forEach((row) => {
    items.push({
      itemId: row.itemId,
      name: row.item.name,
      category: row.item.category,
      isRequired: row.isRequired,
      quantity: row.bagQuantity,
      weightGrams: row.item.weightGrams,
    });
  });

  const allWeights = computeWeightTotals(items);

  return {
    bagName : bag.name,
    items: items,
    totals: allWeights,
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
