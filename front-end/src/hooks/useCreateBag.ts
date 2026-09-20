import { useState } from "react";
import { createBag } from "../api/bags";

export function useCreateBag() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(bagName: string) {
    setLoading(true);
    setError(null);
    try {
      await createBag(bagName);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    submit,
    loading,
    error,
  };
}
