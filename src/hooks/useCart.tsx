import { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";

import type { ProductCartItem } from "../shared/product.types";
import type { Stock } from "../shared/stock.types";
import type {
  CartContextData,
  CartProviderProps,
  UpdateProductAmount,
} from "../shared/useCart.types";

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<ProductCartItem[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  /**
   * ! Truquezinho para atualizaro LocalStorage sempre
   * que o cart for atualizado.
   */
  const prevCartRef = useRef<ProductCartItem[]>();

  useEffect(() => {
    prevCartRef.current = cart;
  });

  const cartPreviousValue = prevCartRef.current ?? cart;

  useEffect(() => {
    if (cartPreviousValue !== cart) {
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
    }
  }, [cartPreviousValue, cart]);

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];
      const productExists = updatedCart.find(({ id }) => productId === id);

      const stock: AxiosResponse<Stock> = await api.get(`stock/${productId}`);

      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists?.amount : 0;
      const newAmountValue = currentAmount + 1;

      if (newAmountValue > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (productExists) {
        productExists.amount = newAmountValue;
      } else {
        const { data: product } = await api.get(`products/${productId}`);

        const newProduct: ProductCartItem = {
          ...product,
          amount: 1,
        };
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];

      const productIndex = updatedCart.findIndex(({ id }) => productId === id);
      if (productIndex !== -1) {
        updatedCart.splice(productIndex, 1);
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return;
      }

      const stock = await api.get(`stock/${productId}`);
      const stockAmount = stock.data.amount;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const updatedCart = [...cart];
      const productAddedInCart = updatedCart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            amount,
          };
        }

        return product;
      });

      setCart(productAddedInCart);
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
