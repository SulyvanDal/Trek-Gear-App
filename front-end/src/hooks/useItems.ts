import { useEffect, useState } from "react";
import type { Item } from "../types/api";
import { getItems } from "../api/items";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    data: items,
    error: error,
    loading: loading,
    refetch: load,
  };
}
