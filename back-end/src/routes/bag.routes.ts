import { Router } from "express";
import {
  getBags,
  getBag,
  createBag,
  deleteBag,
  updateBag,
} from "../controllers/bag.controller.ts";
import { validateIdParam } from "../middlewares/validateIdParam.ts";
import { validateBody } from "../middlewares/validate.ts";
import { createBagSchema, updateBagSchema } from "../schema/bag.schema.ts";

const router = Router();
router.get("/", getBags);
router.get("/:id", validateIdParam, getBag);
router.post("/", validateBody(createBagSchema), createBag);
router.delete("/:id", validateIdParam, deleteBag);
router.patch("/:id", validateIdParam, validateBody(updateBagSchema), updateBag);

export default router;
