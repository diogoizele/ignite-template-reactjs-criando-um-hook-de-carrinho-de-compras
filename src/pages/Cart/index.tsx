import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { Container, ProductTable, Total } from "./styles";

import type {
  CartFormatted,
  ProductCartItem,
} from "../../shared/product.types";

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted: CartFormatted[] = cart.map(
    ({ price, amount, ...product }) => ({
      ...product,
      price,
      priceFormatted: formatPrice(price),
      subTotal: formatPrice(price * amount),
      amount,
    })
  );

  const total = formatPrice(
    cart.reduce(
      (sumTotal, product) => sumTotal + product.amount * product.price,
      0
    )
  );

  async function handleProductIncrement({
    amount,
    id,
  }: Pick<ProductCartItem, "id" | "amount">) {
    updateProductAmount({ productId: id, amount: amount + 1 });
  }

  async function handleProductDecrement({
    amount,
    id,
  }: Pick<ProductCartItem, "id" | "amount">) {
    updateProductAmount({ productId: id, amount: amount - 1 });
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map(
            ({ amount, id, image, price, title, priceFormatted, subTotal }) => (
              <tr data-testid="product" key={id}>
                <td>
                  <img src={image} alt={title} />
                </td>
                <td>
                  <strong>{title}</strong>
                  <span>{priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={amount <= 1}
                      onClick={() => handleProductDecrement({ id, amount })}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement({ id, amount })}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">Finalizar pedido</button>
        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
