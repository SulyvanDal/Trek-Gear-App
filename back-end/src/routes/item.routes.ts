import { Router } from "express";
import {
  getItem,
  getItems,
  createItem,
  deleteItem,
  updateItem,
} from "../controllers/item.controller.ts";
import { validateBody } from "../middlewares/validate.ts";
import { validateIdParam } from "../middlewares/validateIdParam.ts";
import { createItemSchema, updateItemSchema } from "../schema/item.schema.ts";

const router = Router();

router.get("/", getItems);
router.get("/:id", validateIdParam("id"), getItem);
router.post("/", validateBody(createItemSchema), createItem);
router.delete("/:id", validateIdParam("id"), deleteItem);
router.patch(
  "/:id",
  validateIdParam("id"),
  validateBody(updateItemSchema),
  updateItem,
);
export default router;
