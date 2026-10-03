import { useState } from "react";
import { useItems } from "../hooks/useItems";
import type { BagItemLine, Item } from "../types/api";
import { useAddBagItem } from "../hooks/useAddBagItem";
import styles from "./AddBagItemModal.module.css";
import modalStyles from "./Modal.module.css";
import { SelectContainer } from "./SelectContainer";

export function AddBagItemModal({
  bagId,
  containerList,
  onClose,
}: {
  bagId: number;
  containerList : BagItemLine[];
  onClose: () => void;
}) {
  const items = useItems();
  const addItem = useAddBagItem();
  const categories = [
    ...new Set(items.data?.map((item) => item.category)),
  ].sort();
  const [searchText, setSearchText] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [pickedItem, setPickedItem] = useState<Item | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [itemContainerId, setItemContainerId] = useState<number|null>(null);
  const itemsFilteredByCategories = items.data.filter(
    (item) => categoryFilter === "" || item.category === categoryFilter,
  );
  const searchItemsBytext = itemsFilteredByCategories.filter(
    (item) =>
      searchText === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (items.loading) return <p>Chargement des items</p>;
  if (items.error) return <p>{items.error}</p>;
  if (items.data === null) return <p>Aucun item dans l'inventaire</p>;

  async function handleConfirm() {
    if (!pickedItem) return;
    const success = await addItem.submit(bagId, {
      itemId: pickedItem.id,
      bagQuantity: quantity,
      isRequired,
      containerItemId : itemContainerId ?? undefined,
    });
    if (success) onClose();
  }

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            autoFocus
            placeholder="Rechercher un item..."
            className={modalStyles.formField}
            value={searchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              setIsSearchFocused(false);
              if (!pickedItem || pickedItem.name!=searchText){setSearchText("");setPickedItem(null)};
            }}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          {isSearchFocused && (
            <ul className={styles.resultsList}>
              {searchItemsBytext.map((item) => (
                <li
                  key={item.id}
                  className={styles.resultsItem}
                  onMouseDown={() => {
                    setPickedItem(item);
                    setSearchText(item.name);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          className={modalStyles.formField}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
        <SelectContainer containerList={containerList} onChange={setItemContainerId} value={itemContainerId}/>
        <div className={modalStyles.actions}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button
            className={modalStyles.confirmButton}
            disabled={pickedItem === null || addItem.loading}
            onClick={handleConfirm}
          >
            Ajouter au sac
          </button>
        </div>
        {addItem.error && (
          <p className={modalStyles.errorMessage}>{addItem.error}</p>
        )}
      </div>
    </div>
  );
}
