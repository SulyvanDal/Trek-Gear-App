import type { BagItemLine } from "../types/api";

export type BagItemNode = BagItemLine & {
  children: BagItemNode[];
  totalWeightGrams: number;
  requiredWeightGrams: number;
  optionalWeightGrams: number;
};

export function buildBagItemTree(bagItems: BagItemLine[]) {
  const nodesById = new Map<number, BagItemNode>();
  bagItems.forEach((row) => {
    const node: BagItemNode = {
      ...row,
      children: [],
      totalWeightGrams: 0,
      requiredWeightGrams: 0,
      optionalWeightGrams: 0,
    };
    nodesById.set(row.itemId, node);
  });

  const roots: BagItemNode[] = [];
  nodesById.forEach((node) => {
    if (node.containerItemId === null) {
      roots.push(node);
      return;
    }

    const parent = nodesById.get(node.containerItemId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  roots.forEach((root) => {
    computeTotals(root);
  });

  const rangements: BagItemNode[] = [];
  const vrac: BagItemNode[] = [];

  roots.forEach((root) => {
    if (root.category === "Rangement") {
      rangements.push(root);
    } else {
      vrac.push(root);
    }
  });

  rangements.sort((a,b)=>b.totalWeightGrams-a.totalWeightGrams)
  vrac.sort((a,b)=>b.totalWeightGrams-a.totalWeightGrams)

  return {rangements, vrac}
}

function computeTotals(node: BagItemNode) {
  const itemWeight = node.weightGrams * node.quantity;
  node.totalWeightGrams += itemWeight;

  if (node.isRequired) {
    node.requiredWeightGrams += itemWeight;
  } else {
    node.optionalWeightGrams += itemWeight;
  }

  node.children.forEach((childNode) => {
    computeTotals(childNode);
    node.totalWeightGrams += childNode.totalWeightGrams;
    node.requiredWeightGrams += childNode.requiredWeightGrams;
    node.optionalWeightGrams += childNode.optionalWeightGrams;
  });
}
