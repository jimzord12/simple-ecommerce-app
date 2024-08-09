"use client";

import { FaCartShopping } from "react-icons/fa6";
import { Button } from "../../ui/button";
import { Product } from "@/types/db_custom_types";
import CartDrawer from "./CartDrawer";
import { useState } from "react";
import { open } from "fs";

interface CartProps {
  products: Product[];
}

const CartIcon = ({ products }: CartProps) => {
  const productCount = products.length;

  return (
    <>
      <div className="relative flex gap-4 items-center border-2 rounded-xl hover:bg-foreground hover:text-background">
        <div className="w-full h-full p-4 hover:font-background">
          <FaCartShopping
            // color="white"
            // className="hover:text-background"
            size={32}
          />
        </div>
        {productCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {productCount}
          </span>
        )}
      </div>
    </>
  );
};

export default CartIcon;
