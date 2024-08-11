// components/SimpleProductCard.tsx
"use client";

import { Product } from "@/types/db_custom_types";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import CartContext from "@/context/CartContext";
import { alreadyInCart, productToCartItem } from "@/lib/utils";
import { showToast } from "@/lib/showToast";
import StockContext from "@/context/StockContext";
import { useRouter } from "next/navigation";

type SimpleProductCardProps = {
  productCopy: Product;
};

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({
  productCopy,
}) => {
  const router = useRouter();

  const cartContext = useContext(CartContext);
  const stockContext = useContext(StockContext);

  if (!cartContext || !stockContext) {
    throw new Error(
      "ProductsPage must be used within a StockContextProvider and CartContextProvider",
    );
  }

  const { addCartItem, cartItems, increaseCartItemQuantityBy } = cartContext;
  const { decreaseStockBy, products } = stockContext;

  const prodIndex = products.findIndex(
    (p) => p.product_id === productCopy.product_id,
  );

  const product = products[prodIndex];

  useEffect(() => {
    if (product === undefined) {
      showToast("error", "Product not found");
      console.log("SimpleProductCard: Product not found");
      return;
    }
  }, [product]);

  if (!product) {
    return null;
  }

  async function handleProductDelete() {
    const res = await fetch(`/api/products/delete/${product!.product_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("error", "Failed to delete customer");
    } else {
      showToast("success", "Customer deleted successfully");
    }

    router.refresh();
  }

  return (
    <div
      className="flex min-w-[25%] max-w-[460px] items-center gap-8 rounded-lg bg-opacity-45 p-4"
      style={{
        backgroundColor:
          product.stock_quantity > 10
            ? "#3f3f46"
            : product.stock_quantity > 0
              ? "#c2410c"
              : "#b91c1c",
      }}
    >
      <div className="w-[70%]">
        <h2 className="inline-flex">
          <span className="inline-block w-[50px]">Name: </span>
          <span className="inline-block w-[150px] text-end">
            {product.product_name}
          </span>
        </h2>
        <p className="inline-flex">
          <span className="inline-block w-[50px]">ID: </span>
          <span className="inline-block w-[150px] text-end">
            {product.product_id}
          </span>
        </p>
        <p className="inline-flex">
          <span className="inline-block w-[50px]">Desc: </span>
          <span className="inline-block w-[150px] text-end">
            {product.description}
          </span>
        </p>
        <p className="inline-flex">
          <span className="inline-block w-[50px]">Price: </span>
          <span className="inline-block w-[150px] text-end">
            ${product.price}
          </span>
        </p>
        <p className="inline-flex">
          <span className="inline-block w-[50px]">Stock: </span>
          <span className="inline-block w-[150px] text-end">
            {product.stock_quantity}
          </span>
        </p>
      </div>
      <div className="flex w-[30%] flex-col gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            console.log("cartItems: ", cartItems);
            console.log("products: ", products);

            const inCart = alreadyInCart(cartItems, product);

            try {
              if (inCart) {
                decreaseStockBy(product.product_id, 1);
                increaseCartItemQuantityBy(product.product_id, 1);
              } else {
                decreaseStockBy(product.product_id, 1);
                const convertedCartItem = productToCartItem(product);
                addCartItem(convertedCartItem);
              }
            } catch (error) {
              console.log("Error: ", error);
              showToast("error", "Out of stock");
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
