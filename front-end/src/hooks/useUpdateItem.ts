import { useState } from "react";
import { updateItem } from "../api/items";
import type { UpdateItemInput } from "../types/api";

export function useUpdateItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(input : UpdateItemInput, itemId : number) {
    setLoading(true);
    setError(null);
    try {
      await updateItem(input, itemId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {submit, loading, error}
}
