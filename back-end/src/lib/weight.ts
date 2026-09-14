export type WeightLine = {
  weightGrams: number;
  quantity: number;
  isRequired: boolean;
};

export function computeWeightTotals(items: WeightLine[]) {
  let totalWeightGrams = 0;
  let requiredWeightGrams = 0;

  items.forEach((item) => {
    totalWeightGrams += item.weightGrams * item.quantity;
    if (item.isRequired) {
      requiredWeightGrams += item.weightGrams * item.quantity;
    }
  });

  const optionalWeightGrams = totalWeightGrams - requiredWeightGrams;
  return { totalWeightGrams, requiredWeightGrams, optionalWeightGrams };
}
