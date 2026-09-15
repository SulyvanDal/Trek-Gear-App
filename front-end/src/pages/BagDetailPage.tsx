import { useParams } from "react-router-dom";
import { useBagContents } from "../hooks/useBagContents";
import { groupByCategory } from "../utils/groupByCategory";

function BagDetailPage() {
  const param = useParams();
  const bagId = Number(param.id);
  const bagContent = useBagContents(bagId);
  const bagContentByCategory = groupByCategory(bagContent.data);

  if (bagContent.loading) return <p>Chargement des items du sac</p>;
  if (bagContent.error) return <p>{bagContent.error}</p>;

  return (
    <>
      <p>{bagId}</p>
      <ul>
        {bagContentByCategory.map((bag) => (
          <li key={bag.category}>
            <h2>{bag.category}</h2>
            <ul>
              {bag.items.map((row) => (
                <li key={row.itemId}>
                  {row.name}
                  <br/>
                  {String(row.isRequired)}
                  <br/>
                  {row.weightGrams}
                  <br/>
                  {row.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default BagDetailPage;
