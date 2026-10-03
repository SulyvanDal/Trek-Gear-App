import { MdArrowDropDown, MdDelete, MdEdit } from "react-icons/md";
import type { BagItemNode } from "../utils/buildBagItemTree";
import { useState } from "react";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import { ItemRow } from "./ItemRow";
import rowStyles from "./ItemRow.module.css";
import styles from "./RangementRow.module.css";

export type RangementRowProps = {
  node: BagItemNode;
  onEdit: (node: BagItemNode) => void;
  onDelete: (node : BagItemNode) => void;
  depth: number;
};

export function RangementRow({
  node,
  onEdit,
  onDelete,
  depth,
}: RangementRowProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <li className={rowStyles.itemRow} style={{ paddingLeft: depth * 24 }}>
        <button
          className={styles.chevronButton}
          aria-expanded={isOpen}
          title={isOpen ? "Replier" : "Déplier"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdArrowDropDown
            size={20}
            className={`${styles.chevronIcon} ${isOpen ? "" : styles.chevronClosed}`}
          />
        </button>
        <div
          className={`${rowStyles.badgeCore} ${
            node.isRequired ? rowStyles.badgeRequired : rowStyles.badgeOptional
          }`}
        >
          {node.isRequired ? "Obligatoire" : "Optionnel"}
        </div>
        <div className={styles.nameBlock}>
          <div className={styles.rangementName}>{node.name}</div>
          <div className={styles.rangementMeta}>
            {node.children.length === 0
              ? "Vide"
              : `${node.children.length} élément${node.children.length > 1 ? "s" : ""}`}
            {" · "}
            Obligatoire {formatGramsToKg(node.requiredWeightGrams)} kg
            {" · "}
            Optionnel {formatGramsToKg(node.optionalWeightGrams)} kg
          </div>
        </div>
        <div className={rowStyles.itemQuantity}>×{node.quantity}</div>
        <div className={`${rowStyles.itemWeight} ${styles.rangementWeight}`}>
          {formatGramsToKg(node.totalWeightGrams)} kg
        </div>
        <div className={rowStyles.actions}>
          <button
            className={rowStyles.editButton}
            title="Modifier le rangement"
            onClick={() => {
              onEdit(node);
            }}
          >
            <MdEdit size={16} />
          </button>
          <button
            className={rowStyles.deleteButton}
            title="Retirer du sac"
            onClick={() => onDelete(node)}
          >
            <MdDelete size={18} />
          </button>
        </div>
      </li>

      {isOpen &&
        node.children.map((child) =>
          child.category === "Rangement" ? (
            <RangementRow
              key={child.itemId}
              node={child}
              onDelete={onDelete}
              onEdit={onEdit}
              depth={depth + 1}
            />
          ) : (
            <ItemRow
              key={child.itemId}
              node={child}
              onDelete={onDelete}
              onEdit={onEdit}
              depth={depth+1}
            />
          ),
        )}
    </>
  );
}
