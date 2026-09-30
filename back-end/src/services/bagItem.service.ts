import { prisma } from "../lib/prisma.ts";
import { getBagById } from "./bag.service.ts";
import type {
  AddBagItemInput,
  BagItemLine,
  UpdateBagItemInput,
} from "../schema/bagItem.schema.ts";
import { getItemById } from "./item.service.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../lib/errors.ts";
import { Prisma } from "@prisma/client";
import { computeWeightTotals } from "../lib/weight.ts";

async function assertValidContainer(
  bagId: number,
  itemId: number,
  containerItemId: number,
) {
  if (containerItemId === itemId) {
    throw new ValidationError("Le contenant ne peut pas être l'item à ajouter");
  }

  let containerItem = await prisma.bagItem.findUnique({
    where: { bagId_itemId: { bagId, itemId: containerItemId } },
    include: { item: true },
  });

  if (containerItem === null) {
    throw new NotFoundError("Contenant", containerItemId);
  }
  if (containerItem.item.category !== "Rangement") {
    throw new ValidationError(
      "Le contenant cible n'est pas de la catégorie Rangement",
    );
  }

  while (containerItem !== null) {
    if (containerItem.containerItemId === itemId) {
      throw new ConflictError(
        "L'item ne peut pas être le contenant et le contenu",
      );
    }

    if (containerItem.containerItemId !== null) {
      containerItem = await prisma.bagItem.findUnique({
        where: {
          bagId_itemId: { bagId, itemId: containerItem.containerItemId },
        },
        include: { item: true },
      });
    } else {
      containerItem = null;
    }
  }
}

export async function getBagItems(userId: number, bagId: number) {
  //Check si l'id du bag existe, si ko, une erreur interrompre la séquence
  const bag = await getBagById(userId, bagId);

  //Chercher les items lié à un bag.id
  const bagItems = await prisma.bagItem.findMany({
    where: { bagId, item: { ownerId: userId } },
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
      containerItemId: row.containerItemId,
    });
  });

  const allWeights = computeWeightTotals(items);

  return {
    bagName: bag.name,
    items: items,
    totals: allWeights,
  };
}

export async function addItemToBag(
  userId: number,
  bagId: number,
  input: AddBagItemInput,
) {
  //Contrôle de l'existence des objects en BDD
  await getBagById(userId, bagId);
  await getItemById(userId, input.itemId);

  if (input.containerItemId !== undefined) {
    await assertValidContainer(bagId, input.itemId, input.containerItemId);
  }

  try {
    const bagItem = await prisma.bagItem.create({
      data: {
        bagId,
        itemId: input.itemId,
        bagQuantity: input.bagQuantity,
        isRequired: input.isRequired,
        containerItemId: input.containerItemId,
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
      containerItemId: bagItem.containerItemId,
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

export async function updateBagItem(
  userId: number,
  bagId: number,
  itemId: number,
  input: UpdateBagItemInput,
) {
  await getBagById(userId, bagId);
  await getItemById(userId, itemId);
  if (typeof input.containerItemId === "number") {
    await assertValidContainer(bagId, itemId, input.containerItemId);
  }
  try {
    return await prisma.bagItem.update({
      where: { bagId_itemId: { bagId, itemId } },
      data: input,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new NotFoundError("bagItem", `${bagId}/${itemId}`);
    }
    throw err;
  }
}

export async function deleteBagItem(
  userId: number,
  bagId: number,  
  itemId: number,
) {
  await getBagById(userId, bagId);
  await getItemById(userId, itemId);
  try {
    const [_unpacked, deleted] = await prisma.$transaction([
      prisma.bagItem.updateMany({
        where: { bagId, containerItemId: itemId },
        data: { containerItemId: null },
      }),
      prisma.bagItem.delete({
        where: { bagId_itemId: { bagId, itemId } },
      }),
    ]);
    return deleted;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new NotFoundError("bagItem", `${bagId}/${itemId}`);
    }
    throw err;
  }
}
