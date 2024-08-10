"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import CartIcon from "./CartIcon";
import { FaWindowClose } from "react-icons/fa";
import CartItem from "./CartItem";
import { useContext } from "react";
import type { CartItemType } from "../../../types/types";
import CartContext from "@/context/CartContext";

const CartDrawer = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartDrawer must be used within a CartContextProvider");
  }

  const { cartItems, increaseCartItemQuantityBy, decreaseCartItemQuantityBy } =
    cartContext;

  // Calculate total quantity and total price
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );

  return (
    <Drawer direction="right">
      <DrawerTrigger>
        <CartIcon products={cartItems} />
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 min-w-[380px] rounded-none sm:w-full lg:w-[40%]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Your Cart</DrawerTitle>
          <DrawerClose className="w-fit">
            <div className="hover:font-background h-fit w-fit hover:text-red-500">
              <FaWindowClose size={32} />
            </div>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                cartItem={item}
                increaseQuantity={increaseCartItemQuantityBy}
                decreaseQuantity={decreaseCartItemQuantityBy}
              />
            ))
          ) : (
            <>Your cart is empty.</>
          )}
        </div>
        <DrawerFooter className="flex flex-row items-center justify-between rounded-t-lg border-t border-gray-500 bg-gray-700 bg-opacity-40 p-4">
          <div>
            <div className="text-lg text-white">
              Total Items:{" "}
              <span className="ml-8 font-semibold text-sky-300">
                {totalQuantity}
              </span>
            </div>
            <div className="text-lg text-white">
              Total Price:{" "}
              <span className="ml-8 font-semibold text-sky-300">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700">
              Checkout
            </button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
