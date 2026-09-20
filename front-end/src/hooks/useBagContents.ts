import { useState, useEffect } from "react";
import { getBagContents } from "../api/bags";
import type { BagItemLine, Totals } from "../types/api";

export function useBagContents(bagId: number) {
  const [bagContent, setBagContent] = useState<BagItemLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [bagName, setBagName] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getBagContents(bagId);
      setBagContent(data.data);
      setTotals(data.meta.totals);
      setBagName(data.meta.bagName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [bagId]);

  return {
    data: bagContent,
    error: error,
    loading: loading,
    totals: totals,
    bagName: bagName,
    refetch : load,
  };
}
