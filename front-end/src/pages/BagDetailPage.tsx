import { Link, useParams } from "react-router-dom";
import { useBagContents } from "../hooks/useBagContents";
import { groupByCategory } from "../utils/groupByCategory";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import { computeTotalWeight } from "../utils/computeTotalWeight";
import styles from "./BagDetailPage.module.css";

function BagDetailPage() {
  const param = useParams();
  const bagId = Number(param.id);
  const bagContent = useBagContents(bagId);
  const bagContentByCategory = groupByCategory(bagContent.data);

  if (bagContent.loading) return <p>Chargement des items du sac</p>;
  if (bagContent.error) return <p>{bagContent.error}</p>;
  if (!bagContent.totals) return <p>Pas d'item dans le sac</p>;

  return (
    <div className={styles.page}>
      <Link to={"/"} className={styles.buttonBack}>
        ← Sacs
      </Link>
      <div className={styles.header}>
        <h1 className={styles.bagName}>{bagContent.bagName}</h1>
        <div className={styles.totalWeight}>
          {formatGramsToKg(bagContent.totals.totalWeightGrams)} kg
        </div>
      </div>
      <div className={styles.summary}>
        Nécessaire {formatGramsToKg(bagContent.totals.requiredWeightGrams)} kg
        {" · "}
        Optionnel {formatGramsToKg(bagContent.totals.optionalWeightGrams)} kg
      </div>
      <ul className={styles.categoryList}>
        {bagContentByCategory.map((bag) => (
          <li key={bag.category} className={styles.categoryGroup}>
            <div className={styles.categoryHeader}>
              <div className={styles.categoryName}>{bag.category}</div>
              <div className={styles.categoryWeight}>
                {formatGramsToKg(computeTotalWeight(bag.items))} kg
              </div>
            </div>
            <ul className={styles.itemList}>
              {bag.items.map((row) => (
                <li key={row.itemId} className={styles.itemRow}>
                  <div
                    className={`${styles.badgeCore} ${
                      row.isRequired
                        ? styles.badgeRequired
                        : styles.badgeOptional
                    }`}
                  >
                    {row.isRequired ? "Obligatoire" : "Optionnel"}
                  </div>
                  <div className={styles.itemName}>{row.name}</div>
                  <div className={styles.itemQuantity}>×{row.quantity}</div>
                  <div className={styles.itemWeight}>
                    {formatGramsToKg(row.weightGrams * row.quantity)} kg
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BagDetailPage;
