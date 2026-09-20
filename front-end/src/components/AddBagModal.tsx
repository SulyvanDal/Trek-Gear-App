import { useState } from "react";
import { useCreateBag } from "../hooks/useCreateBag";
import modalStyles from "./Modal.module.css";

export function AddBagModal({ onClose }: { onClose: () => void }) {
  const [bagName, setBagName] = useState<string>("");
  const newBag = useCreateBag();

  async function handleConfirm() {
    const success = await newBag.submit(bagName);
    if (success) {
      onClose();
    }
  }

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className={modalStyles.formField}
          value={bagName}
          onChange={(e) => setBagName(e.target.value)}
        ></input>
        <div className={modalStyles.actions}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button
            className={modalStyles.confirmButton}
            disabled={bagName === "" || newBag.loading}
            onClick={handleConfirm}
          >
            Ajouter au sac
          </button>
        </div>
        {newBag.error && (
          <p className={modalStyles.errorMessage}>{newBag.error}</p>
        )}
      </div>
    </div>
  );
}
