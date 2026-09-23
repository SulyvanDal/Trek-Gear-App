import type { Request, Response } from "express";
import {
  getAllItems,
  getItemById,
  createItem as createItemInDB,
  deleteItemById,
  updateItemById,
} from "../services/item.service.ts";
import type {
  CreateItemInput,
  UpdateItemInput,
} from "../schema/item.schema.ts";

export async function getItem(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  const item = await getItemById(userId, id);

  res.status(200).json({ data: item });
}

export async function getItems(req: Request, res: Response) {
  const userId = res.locals.userId;

  const items = await getAllItems(userId);
  res.status(200).json({
    data: items,
    meta: {},
  });
}

export async function createItem(req: Request, res: Response) {
  const userId = res.locals.userId;

  const input = req.body as CreateItemInput;
  const item = await createItemInDB(userId, input);

  res.status(201).json({ data: item });
}

export async function deleteItem(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  await deleteItemById(userId, id);

  res.status(204).end();
}

export async function updateItem(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  const input = req.body as UpdateItemInput;
  const item = await updateItemById(userId, id, input);

  res.status(200).json({ data: item });
}
