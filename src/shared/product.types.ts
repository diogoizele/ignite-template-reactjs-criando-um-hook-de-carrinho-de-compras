export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ProductCartItem extends Product {
  amount: number;
}

export interface CartItemsAmount {
  [key: number]: number;
}

export interface ProductFormatted extends Product {
  priceFormatted: string;
}

export interface CartFormatted extends ProductFormatted {
  subTotal: string;
  amount: number;
}
