import type { Request, Response } from "express";
import {
  getBagItems,
  addItemToBag as addItemToBagInDb,
} from "../services/bagItem.service.ts";
import type { AddBagItemInput } from "../schema/bagItem.schema.ts";

export async function getAllBagItems(req: Request, res: Response) {
  const bagId = Number(req.params.bagId);
  const bagItems = await getBagItems(bagId);

  res.status(200).json({ data: bagItems.items, meta: {totals : bagItems.totals, bagName :bagItems.bagName} });
}

export async function addItemToBag(req: Request, res: Response) {
  const bagId = Number(req.params.bagId);
  const input = req.body as AddBagItemInput;
  const bagItem = await addItemToBagInDb(bagId, input);

  res.status(201).json({ data: bagItem });
}
