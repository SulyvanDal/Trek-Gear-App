export type ApiSuccess<T> = { data: T };

export type ApiSuccessWithMeta<T, M> = { data: T; meta: M };

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

export type Bag = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  totals: Totals;
};

export type BagItemLine = {
  itemId: number;
  name: string;
  category: string;
  isRequired: boolean;
  quantity: number;
  weightGrams: number;
};

export type Totals = {
  totalWeightGrams: number;
  requiredWeightGrams: number;
  optionalWeightGrams: number;
};
