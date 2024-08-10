// components/SimpleProductCard.tsx
"use client";

import { Product } from "@/types/db_custom_types";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartContext from "@/context/CartContext";
import { alreadyInCart, productToCartItem } from "@/lib/utils";

type SimpleProductCardProps = {
  product: Product;
};

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const router = useRouter();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error(
      "ProductsPage must be used within a StockContextProvider and CartContextProvider",
    );
  }

  const { addCartItem, cartItems, increaseCartItemQuantityBy } = cartContext;

  async function handleProductDelete() {
    await fetch(`/api/products/delete/${product.product_id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <div className="flex min-w-[25%] max-w-[400px] items-center gap-8 rounded-lg bg-zinc-700 bg-opacity-45 p-4">
      <div className="w-[70%]">
        <h2>Name: {product.product_name}</h2>
        <p>ID: {product.product_id}</p>
        <p>Desc: {product.description}</p>
        <p>Price ${product.price}</p>
      </div>
      <div className="flex w-[30%] flex-col gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            console.log("cartItems: ", cartItems);

            const inCart = alreadyInCart(cartItems, product);
            if (inCart) {
              increaseCartItemQuantityBy(product.product_id, 1);
            } else {
              const convertedCartItem = productToCartItem(product);
              addCartItem(convertedCartItem);
            }
          }}
        >
          Add Cart
        </Button>
        <div className="flex justify-between gap-4">
          <Link href={`/products/edit?id=${product.product_id}`}>
            <Button variant="outline" size="icon">
              <MdEditSquare color="white" size={24} />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleProductDelete}>
            <MdDeleteForever color="red" size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
