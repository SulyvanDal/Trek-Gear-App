import type { Bag } from "../types/api";
import { request } from "./client";

export function getBags() {
  return request<Bag[]>("/bags");
}
