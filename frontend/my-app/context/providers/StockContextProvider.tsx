// context/MyProvider.tsx
"use client";

import { useState, FC } from "react";
import MyContext, { StockContextState } from "../StockContext";
import { Product } from "../../types/db_custom_types";

// Define the initial state
const initialState: StockContextState = [] as Product[];

const MyProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<StockContextState>(initialState);

  const decreaseStockBy = (id: number, amount: number) => {
    setProducts((prev) => {
      const newProducts = prev.map((product) => {
        if (product.product_id === id) {
          return { ...product, stock: product.stock_quantity - amount };
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
    <MyContext.Provider
      value={{
        products,
        setProducts,
        decreaseStockBy,
        addProduct,
        removeProduct,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
