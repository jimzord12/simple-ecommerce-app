"use client";

import { createContext } from "react";
import type { Order, OrderItem, Product } from "../types/db_custom_types";

export type OrdersContextState = Order[] | [];

// Define the type for your context
export interface OrdersContextType {
  orders: OrdersContextState;
  setOrders: React.Dispatch<React.SetStateAction<OrdersContextState>>;
  removeOrder: (order: Order) => void;
  updateOrder: (updatedOrder: Order) => void;
  error: string | null;
  isLoading: boolean;
  getOrderItems: (order: Order) => Promise<OrderItem[]>;
  updatedItems: OrderItem[];
  updateOrderItemLocally: (
    orderId: number,
    itemId: number,
    amount: number,
    product: Product,
    counter: number,
  ) => void;
  updateOrderItemDB: () => Promise<any[] | undefined>;
  hasContextRan: boolean;
  fetchOrders: () => void;
}

// Create the context with default values (use `undefined` initially)
const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export default OrdersContext;
