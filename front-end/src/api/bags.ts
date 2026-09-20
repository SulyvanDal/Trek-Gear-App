import type {
  BagItemLine,
  Totals,
  Bag,
  AddItemToBagInput,
  UpdateBagItemInput,
} from "../types/api";
import { request, requestWithMeta } from "./client";

export function getBags() {
  return request<Bag[]>("/bags");
}

export function getBagContents(bagId: number) {
  return requestWithMeta<BagItemLine[], { totals: Totals; bagName: string }>(
    `/bags/${bagId}/items`,
  );
}

export async function addItemToBag(bagId: number, input: AddItemToBagInput) {
  return request<BagItemLine>(`/bags/${bagId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateBagItem(bagId: number,itemId :number, input: UpdateBagItemInput) {
  return request<BagItemLine>(`/bags/${bagId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteBagItem(bagId: number, itemId: number) {
  return request<void>(`/bags/${bagId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function createBag(name: string) {
  return request<Bag>("/bags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export async function deleteBag(bagId: number) {
  return request<void>(`/bags/${bagId}`, {
    method: "DELETE",
  });
}
