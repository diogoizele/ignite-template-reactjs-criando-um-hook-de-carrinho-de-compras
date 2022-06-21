import { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

import type {
  CartItemsAmount,
  Product,
  ProductFormatted,
} from "../../shared/product.types";

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce(
    (sumAmount, product) => ({ ...sumAmount, [product.id]: product.amount }),
    {} as CartItemsAmount
  );

  useEffect(() => {
    async function loadProducts() {
      const { data: products } = await api.get<Product[]>("products");

      setProducts(
        products.map(({ price, ...product }) => ({
          ...product,
          price,
          priceFormatted: formatPrice(price),
        }))
      );
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(({ id, image, priceFormatted, title }) => (
        <li key={id}>
          <img src={image} alt={title} />
          <strong>{title}</strong>
          <span>{priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
