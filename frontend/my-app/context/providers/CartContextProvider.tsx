// context/MyProvider.tsx
"use client";
import { useState, FC, useEffect } from "react";
import MyContext, { CartContextState } from "../CartContext";
import { CartItemType } from "../../types/types";

// Define the initial state
const initialState: CartContextState = [] as CartItemType[];

const MyProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartContextState>(initialState);

  const decreaseCartItemQuantityBy = (id: number, amount: number = 1) => {
    setCartItems((prev) => {
      let cartItem = prev.find((item) => item.id === id);

      if (!cartItem) {
        return prev;
      }

      if (cartItem?.quantity - amount <= 0) {
        return prev.filter((item) => item.id !== id);
      }

      const newCartItems = prev.map((cartItem) => {
        if (cartItem.id === id) {
          return { ...cartItem, quantity: cartItem.quantity - amount };
        }
        return cartItem;
      });

      return newCartItems;
    });
  };

  const increaseCartItemQuantityBy = (id: number, amount: number = 1) => {
    setCartItems((prev) => {
      const newCartItems = prev.map((cartItem) => {
        if (cartItem.id === id) {
          return { ...cartItem, quantity: cartItem.quantity + amount };
        }
        return cartItem;
      });

      return newCartItems;
    });
  };

  const addCartItem = (cartItem: CartItemType) => {
    setCartItems((prev) => {
      return [...prev, cartItem];
    });
  };

  const removeCartItem = (cartItem: CartItemType) => {
    setCartItems((prev) => {
      return prev.filter((item) => cartItem.id !== item.id);
    });
  };

  return (
    <MyContext.Provider
      value={{
        cartItems,
        setCartItems,

        decreaseCartItemQuantityBy,
        increaseCartItemQuantityBy,

        addCartItem,
        removeCartItem,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
