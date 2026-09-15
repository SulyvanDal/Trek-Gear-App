import { useEffect, useState } from "react";
import { getBags } from "../api/bags";
import type { Bag } from "../types/api";
import { Link } from "react-router-dom";

function BagsPage() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBags();
        setBags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Chargement des sacs</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <ul>
        {bags.map((bag) => (
          <li key={bag.id}>
            <Link to={`/bags/${bag.id}`}>
              {bag.name} {bag.totals.totalWeightGrams}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
export default BagsPage;
