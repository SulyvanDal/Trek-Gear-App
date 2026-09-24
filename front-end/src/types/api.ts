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

export type Item = {
  id: number;
  name: string;
  weightGrams: number;
  category: string;
  ownedQuantity: number;
  createdAt: string;
  updatedAt: string;
};

export type AddItemToBagInput = {
  itemId: number;
  bagQuantity: number;
  isRequired: boolean;
};

export type UpdateBagItemInput = {
  bagQuantity?: number;
  isRequired?: boolean;
};

export type CreateItemInput = {
  name: string;
  weightGrams: number;
  category: string;
  ownedQuantity: number;
};

export type UpdateItemInput = Partial<CreateItemInput>;

export type RegisterInput = {
  email : string;
  password : string;
}
export type LoginInput = RegisterInput;

