// app/products/page.tsx
"use client";

import SimpleProductCard from "@/components/myComps/SimpleProductCard";
import { Product } from "../../types/db_custom_types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products");
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-2">
      <h1 className=" text-4xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
        Products
      </h1>
      <Link href="/products/add">
        <Button variant="outline" size="lg" className="absolute top-4 right-4">
          Add Product
        </Button>
      </Link>
      {products.map((product) => {
        return (
          <div key={product.product_id} className="ml-4">
            <br />
            <SimpleProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductsPage;
