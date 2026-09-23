import type { Request, Response } from "express";
import {
  getAllBags,
  getBagById,
  createBag as createBagInDb,
  deleteBagById,
  updateBagById,
} from "../services/bag.service.ts";
import type { CreateBagInput, UpdateBagInput } from "../schema/bag.schema.ts";

export async function getBags(_req: Request, res: Response) {
  const userId = res.locals.userId;
  const bags = await getAllBags(userId);
  res.status(200).json({ data: bags, meta: {} });
}

export async function getBag(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  const bag = await getBagById(userId, id);

  res.status(200).json({ data: bag });
}

export async function createBag(req: Request, res: Response) {
  const userId = res.locals.userId;
  const input = req.body as CreateBagInput;
  const bag = await createBagInDb(userId, input);

  res.status(201).json({ data: bag });
}

export async function deleteBag(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  await deleteBagById(userId, id);

  res.status(204).end();
}

export async function updateBag(req: Request, res: Response) {
  const userId = res.locals.userId;
  const id = Number(req.params.id);
  const input = req.body as UpdateBagInput;
  const bag = await updateBagById(userId, id, input);

  res.status(200).json({ data: bag });
}
