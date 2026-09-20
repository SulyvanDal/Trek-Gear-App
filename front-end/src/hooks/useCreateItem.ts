import { useState } from "react";
import { createItem } from "../api/items";
import type { CreateItemInput } from "../types/api";

export function useCreateItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(item : CreateItemInput) {
    setLoading(true);
    setError(null);
    try {
      await createItem(item);
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
