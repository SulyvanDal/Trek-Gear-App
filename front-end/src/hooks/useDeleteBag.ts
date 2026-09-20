import { useState } from "react";
import { deleteBag } from "../api/bags";

export function useDeleteBag() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(bagId: number) {
    setLoading(true);
    setError(null);
    try {
        await deleteBag(bagId);
        return true;
    } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        return false
    }finally{
        setLoading(false);
    }
  }

  return {remove,loading,error}
}
