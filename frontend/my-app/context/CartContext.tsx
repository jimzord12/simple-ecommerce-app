"use client";

import { createContext } from "react";
import { CartItemType } from "../types/types";

export type CartContextState = CartItemType[] | [];

// Define the type for your context
export interface CartContextType {
  cartItems: CartContextState;
  setCartItems: React.Dispatch<React.SetStateAction<CartContextState>>;
  decreaseCartItemQuantityBy: (id: number, amount: number) => void;
  increaseCartItemQuantityBy: (id: number, amount: number) => void;
  addCartItem: (cartItem: CartItemType) => void;
  removeCartItem: (cartItem: CartItemType) => void;
  getTotalPrice: () => number;
}

// Create the context with default values (use `null` or initial values)
const CartContext = createContext<CartContextType | undefined>(undefined);

export default CartContext;
