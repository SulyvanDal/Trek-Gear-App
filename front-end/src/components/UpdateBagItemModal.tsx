import { useState } from "react";
import { useUpdateBagItem } from "../hooks/useUpdateBagItem";
import type { BagItemLine } from "../types/api";
import modalStyles from "./Modal.module.css";

export function UpdateBagItemModal({
  bagId,
  row,
  onClose,
}: {
  bagId: number;
  row: BagItemLine;
  onClose: () => void;
}) {
  const item = useUpdateBagItem();
  const [isRequired, setIsRequired] = useState<boolean>(row.isRequired);
  const [quantity, setQuantity] = useState<number>(row.quantity);

  async function handleConfirm() {
    const success = await item.submit(bagId, row.itemId, {
      bagQuantity: quantity,
      isRequired: isRequired,
    });
    if (success) onClose();
  }

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.stepper}>
          <button
            type="button"
            className={modalStyles.stepperButton}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            className={modalStyles.stepperButton}
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
        <div className={modalStyles.toggleRow}>
          <button
            type="button"
            className={`${modalStyles.toggleButton} ${
              isRequired ? modalStyles.toggleActive : modalStyles.toggleInactive
            }`}
            onClick={() => setIsRequired(true)}
          >
            Obligatoire
          </button>
          <button
            type="button"
            className={`${modalStyles.toggleButton} ${
              !isRequired ? modalStyles.toggleActive : modalStyles.toggleInactive
            }`}
            onClick={() => setIsRequired(false)}
          >
            Optionnel
          </button>
        </div>
        <div className={modalStyles.actions}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button
            className={modalStyles.confirmButton}
            disabled={item.loading}
            onClick={handleConfirm}
          >
            Modifier
          </button>
        </div>
        {item.error && <p className={modalStyles.errorMessage}>{item.error}</p>}
      </div>
    </div>
  );
}
