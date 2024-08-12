// context/MyProvider.tsx
"use client";

import { useState, FC, useEffect } from "react";
import StockContext, { StockContextState } from "../StockContext";
import { Product } from "../../types/db_custom_types";

// Define the initial state
const initialState: StockContextState = [] as Product[];

const MyProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<StockContextState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products");
        const res = await fetch("/api/products", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [reRender]);

  const fetchProducts = () => {
    setReRender((prev) => !prev);
  };

  const decreaseStockBy = (id: number, amount: number) => {
    const product = products.find((product) => product.product_id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock_quantity < amount) {
      throw new Error("Not enough stock");
    }

    setProducts((prev) => {
      const newProducts = prev.map((product) => {
        if (product.product_id === id) {
          return {
            ...product,
            stock_quantity: product.stock_quantity - amount,
          };
        }
        return product;
      });

      return newProducts;
    });
  };

  const increaseStockBy = (id: number, amount: number) => {
    setProducts((prev) => {
      const newProducts = prev.map((product) => {
        if (product.product_id === id) {
          return {
            ...product,
            stock_quantity: product.stock_quantity + amount,
          };
        }
        return product;
      });

      return newProducts;
    });
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const newProducts = [...prev, product];
      return newProducts;
    });
  };

  const removeProduct = (product: Product) => {
    setProducts((prev) => {
      const newProducts = prev.filter(
        (p) => p.product_id !== product.product_id,
      );
      return newProducts;
    });
  };

  return (
    <StockContext.Provider
      value={{
        products,
        setProducts,
        decreaseStockBy,
        increaseStockBy,
        addProduct,
        removeProduct,
        error,
        isLoading,
        fetchProducts,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export default MyProvider;
