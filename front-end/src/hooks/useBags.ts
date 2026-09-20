import { useEffect, useState } from "react";
import { getBags } from "../api/bags";
import type { Bag } from "../types/api";

export function useBags() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getBags();
      setBags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { data : bags, error, loading, refetch : load };
}
