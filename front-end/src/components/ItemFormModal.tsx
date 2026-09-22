import { useState } from "react";
import { useCreateItem } from "../hooks/useCreateItem";
import { useUpdateItem } from "../hooks/useUpdateItem";
import type { Item } from "../types/api";
import { CATEGORY } from "../constants";
import modalStyles from "./Modal.module.css";

export function ItemFormModal({
  item,
  onClose,
}: {
  item: Item | "new";
  onClose: () => void;
}) {
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const [name, setName] = useState<string>(item === "new" ? "" : item.name);
  const [weightGrams, setWeightGrams] = useState<number>(
    item === "new" ? 0 : item.weightGrams,
  );
  const [category, setCategory] = useState<string>(
    item === "new" ? "" : item.category,
  );
  const [ownedQuantity, setOwnedQuantity] = useState<number>(
    item === "new" ? 1 : item.ownedQuantity,
  );

  async function handleConfirm() {
    let success = false;
    if (item === "new") {
      success = await createItem.submit({
        name,
        weightGrams,
        category,
        ownedQuantity,
      });
    } else {
      success = await updateItem.submit(
        { name, weightGrams, category, ownedQuantity },
        item.id,
      );
    }
    if (success) onClose();
  }

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          autoFocus
          placeholder="Nom de l'item"
          className={modalStyles.formField}
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <div className={modalStyles.inputWithSuffix}>
          <input
            type="number"
            className={modalStyles.formField}
            value={weightGrams}
            onChange={(e) => setWeightGrams(e.target.valueAsNumber)}
          ></input>
          <span className={modalStyles.inputSuffix}>Grammes</span>
        </div>
        <select
          className={modalStyles.formField}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {CATEGORY.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <div className={modalStyles.stepper}>
          <button
            type="button"
            className={modalStyles.stepperButton}
            onClick={() => setOwnedQuantity(Math.max(1, ownedQuantity - 1))}
          >
            -
          </button>
          <span>{ownedQuantity}</span>
          <button
            type="button"
            className={modalStyles.stepperButton}
            onClick={() => setOwnedQuantity(ownedQuantity + 1)}
          >
            +
          </button>
        </div>
        <div className={modalStyles.actions}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button
            className={modalStyles.confirmButton}
            disabled={
              name === "" ||
              category === "" ||
              Number.isNaN(weightGrams) ||
              createItem.loading ||
              updateItem.loading
            }
            onClick={handleConfirm}
          >
            Valider l'élément
          </button>
        </div>
        {(createItem.error || updateItem.error) && (
          <p className={modalStyles.errorMessage}>
            {createItem.error || updateItem.error}
          </p>
        )}
      </div>
    </div>
  );
}
