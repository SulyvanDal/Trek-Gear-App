import type { Request, Response } from "express";
import {
  getBagItems,
  addItemToBag as addItemToBagInDb,
  updateBagItem as updateBagItemInDb,
  deleteBagItem as deleteBagItemInDb,
} from "../services/bagItem.service.ts";
import type {
  AddBagItemInput,
  UpdateBagItemInput,
} from "../schema/bagItem.schema.ts";

export async function getAllBagItems(req: Request, res: Response) {
  const userId = res.locals.userId;
  const bagId = Number(req.params.bagId);
  const bagItems = await getBagItems(userId, bagId);

  res.status(200).json({
    data: bagItems.items,
    meta: { totals: bagItems.totals, bagName: bagItems.bagName },
  });
}

export async function addItemToBag(req: Request, res: Response) {
  const userId = res.locals.userId;
  const bagId = Number(req.params.bagId);
  const input = req.body as AddBagItemInput;
  const bagItem = await addItemToBagInDb(userId, bagId, input);

  res.status(201).json({ data: bagItem });
}

export async function updateBagItem(req: Request, res: Response) {
  const userId = res.locals.userId;
  const bagId = Number(req.params.bagId);
  const itemId = Number(req.params.itemId);
  const input = req.body as UpdateBagItemInput;
  const bagItem = await updateBagItemInDb(userId, bagId, itemId, input);

  res.status(200).json({ data: bagItem });
}

export async function deleteBagItem(req: Request, res: Response) {
  const userId = res.locals.userId;
  const bagId = Number(req.params.bagId);
  const itemId = Number(req.params.itemId);
  await deleteBagItemInDb(userId, bagId, itemId);

  res.status(204).end();
}
