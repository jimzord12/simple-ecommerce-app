"use client";

import { createContext } from "react";
import type { Product } from "../types/db_custom_types";

export type StockContextState = Product[] | [];

// Define the type for your context
export interface StockContextType {
  products: StockContextState;
  setProducts: React.Dispatch<React.SetStateAction<StockContextState>>;
  decreaseStockBy: (id: number, amount: number) => void;
  increaseStockBy: (id: number, amount: number) => void;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  error: string | null;
  // setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
}

// Create the context with default values (use `null` or initial values)
const StockContext = createContext<StockContextType | undefined>(undefined);

export default StockContext;
