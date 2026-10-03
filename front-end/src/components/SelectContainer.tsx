import { useId } from "react";
import type { BagItemLine } from "../types/api";
import modalStyles from "./Modal.module.css";
import styles from "./SelectContainer.module.css";

export function SelectContainer({
  containerList,
  value,
  onChange,
}: {
  containerList: BagItemLine[];
  value: number|null;
  onChange: (containerItemId: number|null) => void;
}) {
  const selectId = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={selectId} className={styles.label}>
        Rangement (optionnel)
      </label>
      <select
        id={selectId}
        className={`${modalStyles.formField} ${styles.select}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value===""?null:Number(e.target.value))}
      >
        <option value="">Aucun rangement</option>
        {containerList.map((container) => (
          <option key={container.itemId} value={container.itemId}>
            {container.name}
          </option>
        ))}
      </select>
    </div>
  );
}