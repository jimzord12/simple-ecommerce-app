"use client";

import { CartItemType } from "@/types/types";
import React, { useContext } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import StockContext from "@/context/StockContext";
import CartContext from "@/context/CartContext";
import { showToast } from "@/lib/showToast";

type SimpleCartItemCardProps = {
  cartItem: CartItemType;
};

const SimpleCartItemCard: React.FC<SimpleCartItemCardProps> = ({
  cartItem,
}) => {
  const stockContext = useContext(StockContext);
  const cartContext = useContext(CartContext);

  if (!stockContext || !cartContext) {
    throw new Error(
      "SimpleCartItemCard must be used within a StockContextProvider and CartContextProvider",
    );
  }

  const { increaseStockBy, decreaseStockBy } = stockContext;
  const {
    increaseCartItemQuantityBy,
    decreaseCartItemQuantityBy,
    removeCartItem,
  } = cartContext;

  const handleIncreaseQuantity = () => {
    try {
      increaseCartItemQuantityBy(cartItem.id, 1);
      decreaseStockBy(cartItem.id, 1);
    } catch (error) {
      console.error(error);
      showToast("error", "Not enough stock");
      decreaseCartItemQuantityBy(cartItem.id, 1); // Revert the cart change if stock is not enough
    }
  };

  const handleDecreaseQuantity = () => {
    try {
      if (cartItem.quantity === 1) {
        removeCartItem(cartItem);
        increaseStockBy(cartItem.id, cartItem.quantity);
      } else {
        decreaseCartItemQuantityBy(cartItem.id, 1);
        increaseStockBy(cartItem.id, 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          onClick={handleDecreaseQuantity}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          {cartItem.quantity === 1 ? <FaTrash color="red" /> : <FaMinus />}
        </button>
        <span className="w-12 px-4 text-center">{cartItem.quantity}</span>
        <button
          onClick={handleIncreaseQuantity}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default SimpleCartItemCard;
