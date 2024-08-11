"use client";

import { ReactNode, useEffect, useState } from "react";
import OrdersContext, { OrdersContextState } from "../OrderContext";
import { Order, OrderItem, Product } from "../../types/db_custom_types";
import { apiFetch } from "@/lib/utils";
import { set } from "zod";

interface OrdersProviderProps {
  children: ReactNode;
}

const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>([]);
  const [hasContextRan, setHasContextRan] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders");
        const res = await fetch("/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        console.log("The Orders: ", data);
        setOrders(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        setHasContextRan(true);
      }
    };

    fetchOrders();
  }, []);

  const removeOrder = (order: Order) => {
    setOrders((prevOrders) =>
      prevOrders.filter((o) => o.order_id !== order.order_id),
    );
  };

  const getOrderItems = async (order: Order) => {
    const orderItems = order.items.map(async (item): Promise<OrderItem> => {
      const response = await apiFetch(
        `/orders/${order.order_id}/items/${item.order_item_id}`,
        { cache: "no-store" },
      );
      return response; // Assuming the API returns JSON
    });

    const results = await Promise.all(orderItems);
    console.log("Result Items: ", results);

    return results;
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order: Order) =>
        order.order_id === updatedOrder.order_id ? updatedOrder : order,
      ),
    );
  };

  const updateOrderItemLocally = (
    orderId: number,
    itemId: number,
    amount: number,
    product: Product,
  ) => {
    const order = orders.find((order) => order.order_id === orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const item = order.items.find((item) => item.order_item_id === itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (product.stock_quantity < item.quantity + amount) {
      throw new Error("Insufficient stock");
    }

    if (item.quantity + amount < 0) {
      throw new Error("Quantity cannot be less than 0");
    }

    setOrders((prevOrders) =>
      prevOrders.map((order: Order) => {
        if (order.order_id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item: OrderItem) => {
            if (itemId === item.order_item_id) {
              console.log("I am updating the Item: ", item);
              setUpdatedItems((prev) => [
                ...prev,
                {
                  ...item,
                  quantity: item.quantity + amount,
                  price: product.price * (item.quantity + amount),
                },
              ]);
              return {
                ...item,
                quantity: item.quantity + amount,
                price: product.price * (item.quantity + amount),
              };
            }
            return item;
          }),
        };
      }),
    );
  };

  const updateOrderItemDB = async () => {
    if (!updatedItems.length) return;

    try {
      const promises = updatedItems.map((item) => {
        if (item.quantity <= 0) {
          apiFetch(`/orders/${item.order_id}/items/${item.order_item_id}`, {
            method: "DELETE",
            cache: "no-store",
          });
        } else {
          apiFetch(`/orders/${item.order_id}/items/${item.order_item_id}`, {
            method: "PUT",
            body: JSON.stringify(item),
            cache: "no-store",
          });
        }
      });

      const results: (OrderItem | void)[] = await Promise.all(promises);

      results.forEach((item, i, arr) => {
        if (!item) return;
        if (item.order_id == 0 || !item.order_item_id) {
          throw new Error(`"Failed to update order item: ${arr[i]}`);
        }
      });

      return results;
    } catch (error) {
      throw error;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        setOrders,
        removeOrder,
        updateOrder,
        updatedItems,
        updateOrderItemLocally,
        updateOrderItemDB,
        getOrderItems,
        error,
        isLoading,
        hasContextRan,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
