import { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { CartItemType } from "@/types/types";

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
  const [quantity, setQuantity] = useState(cartItem.quantity || 1);

  // const increaseQuantity = () => {
  //   setQuantity((prev) => prev + 1);
  // };

  // const decreaseQuantity = () => {
  //   if (quantity > 1) {
  //     setQuantity((prev) => prev - 1);
  //   } else {
  //     onRemove(cartItem);
  //   }
  // };

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
          onClick={() => decreaseQuantity(cartItem.id, 1)}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          {cartItem.quantity === 1 ? <FaTrash color="red" /> : <FaMinus />}
        </button>
        <span className="w-12 px-4 text-center">{cartItem.quantity}</span>
        <button
          onClick={() => increaseQuantity(cartItem.id, 1)}
          className="rounded-full bg-gray-200 p-1 text-slate-900 hover:bg-gray-300"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
