import { Link } from "react-router-dom";
import styles from "./BagsPage.module.css";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import { useBags } from "../hooks/useBags";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { AddBagModal } from "../components/AddBagModal";

function BagsPage() {
  const bags = useBags();
  const [isModalOpen, setIseModalOpen] = useState<boolean>(false);
  if (bags.loading) return <p>Chargement des sacs</p>;
  if (bags.error) return <p>{bags.error}</p>;

  return (
    <div className={styles.bagsPage}>
      <button
        className={styles.addBagButton}
        onClick={() => setIseModalOpen(true)}
      >
        <MdAdd size={18} /> Créer un sac
      </button>
      <ul className={styles.bagsGrid}>
        {bags.data.map((bag) => {
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
                <div className={styles.bagTitle}>{bag.name}</div>
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
                <div
                  className={`${styles.weightRequiredAndOptional} ${styles.weightName}`}
                >
                  <div>
                    Obligatoire{" "}
                    {formatGramsToKg(bag.totals.requiredWeightGrams)}
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

      {isModalOpen && (
        <AddBagModal
          onClose={() => {
            setIseModalOpen(false);
            bags.refetch();
          }}
        />
      )}
    </div>
  );
}
export default BagsPage;
