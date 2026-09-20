import { useState } from "react";
import type { UpdateBagItemInput } from "../types/api";
import { updateBagItem } from "../api/bags";

export function useUpdateBagItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(
    bagId: number,
    itemId: number,
    input: UpdateBagItemInput,
  ) {
    setLoading(true);
    setError(null);
    try {
      await updateBagItem(bagId, itemId, input);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
