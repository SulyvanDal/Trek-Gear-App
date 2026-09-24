import type { LoginInput, RegisterInput } from "../types/api";
import { request } from "./client";

export async function register(input: RegisterInput) {
  return request<string>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function login(input: LoginInput) {
  return request<string>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
