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
import {
  addItemToBag,
  getAllBagItems,
  updateBagItem,
  deleteBagItem
} from "../controllers/bagItem.controller.ts";
import {
  addBagItemSchema,
  updateBagItemSchema,
} from "../schema/bagItem.schema.ts";

const router = Router();
router.get("/", getBags);
router.get("/:id", validateIdParam("id"), getBag);
router.post("/", validateBody(createBagSchema), createBag);
router.delete("/:id", validateIdParam("id"), deleteBag);
router.patch(
  "/:id",
  validateIdParam("id"),
  validateBody(updateBagSchema),
  updateBag,
);

router.get("/:bagId/items", validateIdParam("bagId"), getAllBagItems);
router.post(
  "/:bagId/items",
  validateIdParam("bagId"),
  validateBody(addBagItemSchema),
  addItemToBag,
);
router.patch(
  "/:bagId/items/:itemId",
  validateIdParam("bagId"),
  validateIdParam("itemId"),
  validateBody(updateBagItemSchema),
  updateBagItem,
);
router.delete(
  "/:bagId/items/:itemId",
  validateIdParam("bagId"),
  validateIdParam("itemId"),
  deleteBagItem,
);

export default router;
