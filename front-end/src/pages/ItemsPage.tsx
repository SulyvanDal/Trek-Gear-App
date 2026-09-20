import { useState } from "react";
import { useItems } from "../hooks/useItems";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import styles from "./ItemsPage.module.css";
import type { Item } from "../types/api";
import { ItemFormModal } from "../components/ItemFormModal";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDeleteItem } from "../hooks/useDeleteItem";

function ItemsPage() {
  const items = useItems();
  const removeItem = useDeleteItem();
  const [formTarget, setFormTarget] = useState<Item | "new" | null>(null);

  async function handleDeleteConfirm(itemId: number) {
    if (window.confirm("Voulez-vous supprimer cet item ?")) {
      const success = await removeItem.remove(itemId);
      if (success) items.refetch();
    }
  }
  if (items.loading) return <p>Chargement des items</p>;
  if (items.error) return <p>{items.error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Inventaire</h1>
        <button
          className={styles.addItemButton}
          onClick={() => setFormTarget("new")}
        >
          + Ajouter un élément
        </button>
      </div>

      <ul className={styles.itemsBox}>
        {items.data.map((item) => {
          return (
            <li
              key={item.id}
              className={styles.itemRow}
              onClick={() => {
                setFormTarget(item);
              }}
            >
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>
              <div className={styles.itemQuantity}>×{item.ownedQuantity}</div>
              <div className={styles.itemWeight}>
                {formatGramsToKg(item.weightGrams)}kg
              </div>
              <button
                className={styles.editButton}
                onClick={() => setFormTarget(item)}
              >
                <MdEdit />
              </button>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConfirm(item.id);
                }}
              >
                <MdDelete />
              </button>
            </li>
          );
        })}
      </ul>
      {formTarget && (
        <ItemFormModal
          item={formTarget}
          onClose={() => {
            setFormTarget(null);
            items.refetch();
          }}
        />
      )}
    </div>
  );
}

export default ItemsPage;
