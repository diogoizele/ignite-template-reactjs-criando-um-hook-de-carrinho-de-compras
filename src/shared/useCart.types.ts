import type { ReactNode } from "react";
import type { ProductCartItem } from "./product.types";

export interface CartProviderProps {
  children: ReactNode;
}

export interface UpdateProductAmount {
  productId: number;
  amount: number;
}

export interface CartContextData {
  cart: ProductCartItem[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}
