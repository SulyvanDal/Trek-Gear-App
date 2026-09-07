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
  const bags = await getAllBags();
  res.status(200).json({ data: bags, meta: {} });
}

export async function getBag(req: Request, res: Response) {
  const id = Number(req.params.id);
  const bag = await getBagById(id);

  res.status(200).json({ data: bag });
}

export async function createBag(req: Request, res: Response) {
  const input = req.body as CreateBagInput;
  const bag = await createBagInDb(input);

  res.status(201).json({ data: bag });
}

export async function deleteBag(req: Request, res: Response) {
  const id = Number(req.params.id);
  await deleteBagById(id);

  res.status(204).end();
}

export async function updateBag(req: Request, res: Response) {
  const id = Number(req.params.id);
  const input = req.body as UpdateBagInput;
  const bag = await updateBagById(id, input);

  res.status(200).json({ data: bag });
}
