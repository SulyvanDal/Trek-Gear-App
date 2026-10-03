import styles from "./ItemRow.module.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { formatGramsToKg } from "../utils/formatGramsToKg";
import type { BagItemNode } from "../utils/buildBagItemTree";

type ItemRowProps = {
  node: BagItemNode;
  onEdit: (node: BagItemNode) => void;
  onDelete: (node: BagItemNode) => void;
  depth : number;
};
export function ItemRow({ node, onEdit, onDelete, depth }: ItemRowProps) {
  return (
    <li className={styles.itemRow} style={{ paddingLeft: depth * 24 }}>
      <div className={styles.spacer} />
      <div
        className={`${styles.badgeCore} ${
          node.isRequired ? styles.badgeRequired : styles.badgeOptional
        }`}
      >
        {node.isRequired ? "Obligatoire" : "Optionnel"}
      </div>
      <div className={styles.itemName}>{node.name}</div>
      <div className={styles.itemQuantity}>×{node.quantity}</div>
      <div className={styles.itemWeight}>
        {formatGramsToKg(node.weightGrams * node.quantity)} kg
      </div>
      <div className={styles.actions}>
        <button
          className={styles.editButton}
          title="Modifier"
          onClick={() => {
            onEdit(node);
          }}
        >
          <MdEdit size={16} />
        </button>
        <button
          className={styles.deleteButton}
          title="Retirer du sac"
          onClick={() => onDelete(node)}
        >
          <MdDelete size={18} />
        </button>
      </div>
    </li>
  );
}
