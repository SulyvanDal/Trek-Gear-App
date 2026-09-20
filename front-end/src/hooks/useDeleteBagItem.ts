import { useState } from "react";
import { deleteBagItem } from "../api/bags";

export function useDeleteBagItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(bagId: number, itemId: number) {
    setLoading(true);
    setError(null);
    try {
      await deleteBagItem(bagId, itemId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }
  return { remove, loading, error };
}
