import { Link, useNavigate, useParams } from "react-router-dom";
import { useBagContents } from "../hooks/useBagContents";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import styles from "./BagDetailPage.module.css";
import { AddBagItemModal } from "../components/AddBagItemModal";
import { useState } from "react";
import { useDeleteBagItem } from "../hooks/useDeleteBagItem";
import { MdDelete } from "react-icons/md";
import { useDeleteBag } from "../hooks/useDeleteBag";
import { UpdateBagItemModal } from "../components/UpdateBagItemModal";
import type { BagItemLine } from "../types/api";
import { buildBagItemTree, type BagItemNode } from "../utils/buildBagItemTree";
import { RangementRow } from "../components/RangementRow";
import { ItemRow } from "../components/ItemRow";

function BagDetailPage() {
  const param = useParams();
  const bagId = Number(param.id);
  const bagContent = useBagContents(bagId);
  const bagContentByContainers = buildBagItemTree(bagContent.data);
  const removeItem = useDeleteBagItem();
  const removeBag = useDeleteBag();
  const navigate = useNavigate();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
  const [itemTarget, setItemtarget] = useState<BagItemLine | null>(null);

  if (bagContent.loading) return <p>Chargement des items du sac</p>;
  if (bagContent.error) return <p>{bagContent.error}</p>;
  if (!bagContent.totals) return <p>Pas d'item dans le sac</p>;

  async function handleDeleteItemConfirm(node: BagItemNode) {
    const message =
      node.category === "Rangement"
        ? "Voulez-vous retirer le rangement du sac ? Les items présents seront en vrac"
        : "Voulez- vous retirer cet item du sac ?";
    if (window.confirm(message)) {
      const success = await removeItem.remove(bagId, node.itemId);
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
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleBlock}>
          <div className={styles.sectionTitle}>Rangements</div>
          <div className={styles.sectionMeta}>
            {bagContentByContainers.rangements.length} rangements
            {" · "}
            Obligatoire{" "}
            {formatGramsToKg(
              bagContentByContainers.rangements.reduce(
                (somme, node) => somme + node.requiredWeightGrams,
                0,
              ),
            )}{" "}
            kg
            {" · "}
            Optionnel{" "}
            {formatGramsToKg(
              bagContentByContainers.rangements.reduce(
                (somme, node) => somme + node.optionalWeightGrams,
                0,
              ),
            )}{" "}
            kg
          </div>
        </div>
        <div className={styles.sectionWeight}>
          {formatGramsToKg(
            bagContentByContainers.rangements.reduce(
              (somme, node) => somme + node.totalWeightGrams,
              0,
            ),
          )}{" "}
          kg
        </div>
      </div>
      <ul className={styles.categoryList}>
        {bagContentByContainers.rangements.map((row) => (
          <RangementRow
            key={row.itemId}
            node={row}
            onEdit={(node) => setItemtarget(node)}
            onDelete={(node) => handleDeleteItemConfirm(node)}
            depth={0}
          />
        ))}
      </ul>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleBlock}>
          <div className={styles.sectionTitle}>En vrac</div>
          <div className={styles.sectionMeta}>
            {bagContentByContainers.vrac.length} éléments
            {" · "}
            Obligatoire{" "}
            {formatGramsToKg(
              bagContentByContainers.vrac.reduce(
                (somme, node) => somme + node.requiredWeightGrams,
                0,
              ),
            )}{" "}
            kg
            {" · "}
            Optionnel{" "}
            {formatGramsToKg(
              bagContentByContainers.vrac.reduce(
                (somme, node) => somme + node.optionalWeightGrams,
                0,
              ),
            )}{" "}
            kg
          </div>
        </div>
        <div className={styles.sectionWeight}>
          {formatGramsToKg(
            bagContentByContainers.vrac.reduce(
              (somme, node) => somme + node.totalWeightGrams,
              0,
            ),
          )}{" "}
          kg
        </div>
      </div>
      <ul className={styles.categoryList}>
        {bagContentByContainers.vrac.map((row) => (
          <ItemRow
            key={row.itemId}
            node={row}
            onDelete={(node) => handleDeleteItemConfirm(node)}
            onEdit={(node) => setItemtarget(node)}
            depth={0}
          />
        ))}
      </ul>

      {isModalCreateOpen && (
        <AddBagItemModal
          bagId={bagId}
          containerList={bagContent.data.filter((line)=>line.category==="Rangement")}
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
          containerList={bagContent.data.filter((line)=>line.category==="Rangement")}
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
