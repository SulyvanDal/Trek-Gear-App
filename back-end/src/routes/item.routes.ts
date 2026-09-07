import { Router } from "express";
import { getItem, getItems, createItem, deleteItem, patchItem } from "../controllers/item.controller.ts";
import { validateBody } from "../middlewares/validate.ts";
import { validateIdParam } from "../middlewares/validateIdParam.ts";
import { createItemSchema, updateItemSchema } from "../schema/item.schema.ts";

const router= Router();

router.get("/", getItems)
router.get("/:id", validateIdParam, getItem);
router.post("/", validateBody(createItemSchema),createItem)
router.delete("/:id",validateIdParam, deleteItem)
router.patch("/:id",validateIdParam, validateBody(updateItemSchema),patchItem)
export default router;