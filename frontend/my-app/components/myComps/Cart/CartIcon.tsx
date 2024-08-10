"use client";

import { FaCartShopping } from "react-icons/fa6";
import { Button } from "../../ui/button";
import { Product } from "@/types/db_custom_types";
import CartDrawer from "./CartDrawer";
import { useState } from "react";
import { open } from "fs";
import { CartItemType } from "@/types/types";

interface CartProps {
  products: CartItemType[];
}

const CartIcon = ({ products }: CartProps) => {
  const productCount = products.length;

  return (
    <>
      <div className="relative flex items-center gap-4 rounded-xl border-2 hover:bg-foreground hover:text-background">
        <div className="hover:font-background h-full w-full p-4">
          <FaCartShopping
            // color="white"
            // className="hover:text-background"
            size={32}
          />
        </div>
        {productCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {productCount}
          </span>
        )}
      </div>
    </>
  );
};

export default CartIcon;
