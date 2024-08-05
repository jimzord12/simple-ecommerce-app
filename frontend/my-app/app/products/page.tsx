// app/products/page.tsx
"use client";

import { Product } from "../../types/db_custom_types";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => {
          return (
            <div key={product.product_id} className="ml-4">
              <br />
              <li>
                <h2>Name: {product.product_name}</h2>
                <p>ID: {product.product_id}</p>
                <p>Desc: {product.description}</p>
                <p>Price ${product.price}</p>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductsPage;
