import type { BagItemLine } from "../types/api";

export function computeTotalWeight(items :  BagItemLine[]){
    let total : number = 0;
    items.forEach((row) => {
        total += row.weightGrams*row.quantity;
    });

    return total;
}