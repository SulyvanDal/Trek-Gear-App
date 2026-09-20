import { useState } from "react";
import type { AddItemToBagInput } from "../types/api";
import { addItemToBag } from "../api/bags";

export function useAddBagItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(bagId: number, input: AddItemToBagInput) {
    setLoading(true);
    setError(null);
    try {
      await addItemToBag(bagId, input);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur Inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }
  return { submit, loading, error };
}
