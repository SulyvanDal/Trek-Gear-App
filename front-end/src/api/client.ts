import type { ApiSuccess, ApiError, ApiSuccessWithMeta } from "../types/api";

const BASE_URL = "http://localhost:3000/api";

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(BASE_URL + path, options);
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok) {
    const message = "error" in body ? body.error.message : "Erreur inconnue";
    throw new Error(message);
  }
  return (body as ApiSuccess<T>).data;
}

export async function requestWithMeta<T, M>(
  path: string,
  options?: RequestInit,
): Promise<ApiSuccessWithMeta<T, M>> {
  const res = await fetch(BASE_URL + path, options);
  const body = (await res.json()) as ApiSuccessWithMeta<T, M> | ApiError;
  if (!res.ok) {
    const message = "error" in body ? body.error.message : "erreur inconnue";
    throw new Error(message);
  }
  return body as ApiSuccessWithMeta<T, M>;
}
