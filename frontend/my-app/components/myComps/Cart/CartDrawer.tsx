"use client";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import CartIcon from "./CartIcon";
import { Product } from "@/types/db_custom_types";

interface CartDrawerProps {
  products: Product[];
}

const CartDrawer = ({ products }: CartDrawerProps) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger>
        {/* <p className="bg-blue-500 text-white p-2 rounded-md">Open Drawer</p> */}
        <CartIcon products={products} />
      </DrawerTrigger>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[60%] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Your Cart</DrawerTitle>
          <DrawerClose>Close</DrawerClose>
        </DrawerHeader>
        <DrawerDescription>
          <p>Car Drawer Description</p>
        </DrawerDescription>
        <DrawerFooter>
          <button className="bg-blue-500 text-white p-2 rounded-md self-center">
            Proceed to Checkout
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
