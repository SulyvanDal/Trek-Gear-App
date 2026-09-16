import { useEffect, useState } from "react";
import { getBags } from "../api/bags";
import type { Bag } from "../types/api";
import { Link } from "react-router-dom";
import styles from "./BagsPage.module.css";
import { formatGramsToKg } from "../utils/formatGramsToKg";

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
    <div className={styles.bagsPage}>
      <ul className={styles.bagsGrid}>
        {bags.map((bag) => {
          const requiredPercent =
            bag.totals.totalWeightGrams === 0
              ? 0
              : (bag.totals.requiredWeightGrams / bag.totals.totalWeightGrams) *
                100;
          const optionnalPercent = 100 - requiredPercent;
          return (
            <li key={bag.id}>
              <Link to={`/bags/${bag.id}`} className={styles.card}>
                <div className={styles.bagWeightTitle}>
                  {formatGramsToKg(bag.totals.totalWeightGrams)} kg
                </div>
                <div className={styles.bagTitle}>
                  {bag.name} 
                </div>
                <div className={styles.conteneurBarre}>
                  <div
                    className={`${styles.barreSegmentcore} ${styles.barreSegmentRequiredWeight}`}
                    style={{ width: `${requiredPercent}%` }}
                  />
                  <div
                    className={`${styles.barreSegmentcore} ${styles.barreSegmentOptionalWeight}`}
                    style={{ width: `${optionnalPercent}%` }}
                  />
                </div>
                <div className={`${styles.weightRequiredAndOptional} ${styles.weightName}`}>
                  <div>
                    Nécessaire {formatGramsToKg(bag.totals.requiredWeightGrams)}
                    kg
                  </div>
                  <div>
                    Optionnel {formatGramsToKg(bag.totals.optionalWeightGrams)}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default BagsPage;
