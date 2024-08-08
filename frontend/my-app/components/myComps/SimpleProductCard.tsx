// components/SimpleProductCard.tsx
"use client";

import { Product } from "@/types/db_custom_types";
import React from "react";
import { Button } from "../ui/button";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SimpleProductCardProps = {
  product: Product;
};

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const router = useRouter();

  async function handleProductDelete() {
    await fetch(`/api/products/delete/${product.product_id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <div className="bg-zinc-700 bg-opacity-45 max-w-[400px] p-4 rounded-lg flex gap-8 items-center min-w-[25%]">
      <div className="w-[70%]">
        <h2>Name: {product.product_name}</h2>
        <p>ID: {product.product_id}</p>
        <p>Desc: {product.description}</p>
        <p>Price ${product.price}</p>
      </div>
      <div className="flex flex-col w-[30%] gap-4">
        <Button variant="default" size="lg">
          Add Cart
        </Button>
        <div className="flex gap-4 justify-between ">
          <Link href={`/products/edit?id=${product.product_id}`}>
            <Button variant="outline" size="icon">
              <MdEditSquare color="white" size={24} />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleProductDelete}>
            <MdDeleteForever color="white" size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
