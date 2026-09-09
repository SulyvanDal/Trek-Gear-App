export type ApiSuccess<T> = { data: T };

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
};
