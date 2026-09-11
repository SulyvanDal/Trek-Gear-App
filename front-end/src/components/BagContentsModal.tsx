import { useEffect, useState } from "react";
import type { BagItemLine } from "../types/api";
import { getBagContents } from "../api/bags";

export function BagContentsModal({
  bagId,
  onClose,
}: {
  bagId: number;
  onClose: () => void;
}) {
  const [bagContent, setBagContent] = useState<BagItemLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const [totals, setTotals] = useState<Totals | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBagContents(bagId);
        setBagContent(data.data);
        //setTotals(data.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bagId]);

  if (loading) return <p>Chargement des items du sac</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <ul>
        {bagContent.map((bagItem) => (
          <li key={bagItem.itemId}>
            Nom : {bagItem.name}
            <br />
            Catégorie : {bagItem.category}
            <br />
            Quantité : {bagItem.quantity}
            <br />
            Poids : {bagItem.weightGrams}
            <br />
            {bagItem.isRequired ? "Obligatoire" : "Optionnel"}
            <br />
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Fermer</button>
    </>
  );
}
