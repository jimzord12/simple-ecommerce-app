import { useContext, useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { CartItemType } from "@/types/types";
import StockContext from "@/context/StockContext";
import { showToast } from "@/lib/showToast";

interface CartItemProps {
  cartItem: CartItemType;
  increaseQuantity: (id: number, amount: number) => void;
  decreaseQuantity: (id: number, amount: number) => void;
}

const CartItem = ({
  cartItem,
  increaseQuantity,
  decreaseQuantity,
}: CartItemProps) => {
  const stockContext = useContext(StockContext);

  if (!stockContext) {
    throw new Error(
      "ProductsPage must be used within a StockContextProvider and CartContextProvider",
    );
  }

  const { increaseStockBy, decreaseStockBy } = stockContext;

  // const prodIndex = products.findIndex((p) => p.product_id === cartItem.id);

  // const product = products[prodIndex];

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-semibold">{cartItem.name}</p>
          <p className="text-gray-500">
            ${(cartItem.price * cartItem.quantity).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex min-w-24 items-center gap-2">
        <button
          onClick={() => {
            try {
              decreaseQuantity(cartItem.id, 1);
              increaseStockBy(cartItem.id, 1);
            } catch (error) {
              increaseQuantity(cartItem.id, 1);
              console.error(error);
            }
          }}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          {cartItem.quantity === 1 ? <FaTrash color="red" /> : <FaMinus />}
        </button>
        <span className="w-12 px-4 text-center">{cartItem.quantity}</span>
        <button
          onClick={() => {
            try {
              increaseQuantity(cartItem.id, 1);
              decreaseStockBy(cartItem.id, 1);
            } catch (error) {
              console.error(error);
              showToast("error", "Not enough stock");
              decreaseQuantity(cartItem.id, 1);
            }
          }}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
