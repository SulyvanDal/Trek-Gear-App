import { useState } from "react";
import { deleteItem } from "../api/items";

export function useDeleteItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(itemId : number) {
    setLoading(true);
    setError(null);
    try {
      await deleteItem(itemId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {remove, loading, error}
}
