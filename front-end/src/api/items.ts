import type { CreateItemInput, Item, UpdateItemInput } from "../types/api";
import { request } from "./client";

export async function getItems() {
  return request<Item[]>("/items");
}

export async function createItem(input: CreateItemInput) {
  return request<Item>("/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateItem(input : UpdateItemInput, itemId : number){
    return request<Item>(`/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteItem(itemId : number){
  return request<void>(`/items/${itemId}`, {method : "DELETE"})
}
