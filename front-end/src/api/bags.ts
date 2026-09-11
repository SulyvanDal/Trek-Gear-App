import type { BagItemLine, Totals, Bag } from "../types/api";
import { request, requestWithMeta } from "./client";

export function getBags() {
  return request<Bag[]>("/bags");
}

export function getBagContents(bagId: number) {
  return requestWithMeta<BagItemLine[], Totals>(`/bags/${bagId}/items`);
}
