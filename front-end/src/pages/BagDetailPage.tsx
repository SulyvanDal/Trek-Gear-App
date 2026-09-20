import { Link, useNavigate, useParams } from "react-router-dom";
import { useBagContents } from "../hooks/useBagContents";
import { groupByCategory } from "../utils/groupByCategory";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import { computeTotalWeight } from "../utils/computeTotalWeight";
import styles from "./BagDetailPage.module.css";
import { AddBagItemModal } from "../components/AddBagItemModal";
import { useState } from "react";
import { useDeleteBagItem } from "../hooks/useDeleteBagItem";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDeleteBag } from "../hooks/useDeleteBag";
import { UpdateBagItemModal } from "../components/UpdateBagItemModal";
import type { BagItemLine } from "../types/api";

function BagDetailPage() {
  const param = useParams();
  const bagId = Number(param.id);
  const bagContent = useBagContents(bagId);
  const bagContentByCategory = groupByCategory(bagContent.data);
  const removeItem = useDeleteBagItem();
  const removeBag = useDeleteBag();
  const navigate = useNavigate();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
  const [itemTarget, setItemtarget] = useState<BagItemLine | null>(null);

  if (bagContent.loading) return <p>Chargement des items du sac</p>;
  if (bagContent.error) return <p>{bagContent.error}</p>;
  if (!bagContent.totals) return <p>Pas d'item dans le sac</p>;

  async function handleDeleteItemConfirm(itemId: number) {
    if (window.confirm("Voulez- vous supprimer cet item ?")) {
      const success = await removeItem.remove(bagId, itemId);
      if (success) {
        bagContent.refetch();
      }
    }
    return;
  }

  async function handleDeleteBagConfirm() {
    if (window.confirm("Voulez-vous supprimer ce sac ?")) {
      const success = await removeBag.remove(bagId);
      if (success) {
        navigate("/bags");
      }
    }
  }
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to={"/bags"} className={styles.buttonBack}>
          ← Sacs
        </Link>
        <button
          className={styles.deleteBagButton}
          onClick={() => handleDeleteBagConfirm()}
        >
          <MdDelete size={20} />
        </button>
      </div>
      <div className={styles.header}>
        <h1 className={styles.bagName}>{bagContent.bagName}</h1>
        <div className={styles.totalWeight}>
          {formatGramsToKg(bagContent.totals.totalWeightGrams)} kg
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.summary}>
          Obligatoire {formatGramsToKg(bagContent.totals.requiredWeightGrams)}{" "}
          kg
          {" · "}
          Optionnel {formatGramsToKg(bagContent.totals.optionalWeightGrams)} kg
        </div>
        <button
          className={styles.addItemButton}
          onClick={() => setIsModalCreateOpen(true)}
        >
          + Ajouter un élément
        </button>
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
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setItemtarget(row);
                    }}
                  >
                    <MdEdit/>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteItemConfirm(row.itemId)}
                  >
                    <MdDelete size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {isModalCreateOpen && (
        <AddBagItemModal
          bagId={bagId}
          onClose={() => {
            setIsModalCreateOpen(false);
            bagContent.refetch();
          }}
        />
      )}

      {itemTarget && (
        <UpdateBagItemModal
          bagId={bagId}
          row={itemTarget}
          onClose={() => {
            setItemtarget(null);
            bagContent.refetch();
          }}
        />
      )}
    </div>
  );
}

export default BagDetailPage;
