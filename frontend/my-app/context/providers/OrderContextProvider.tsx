"use client";

import { cache, ReactNode, useContext, useEffect, useState } from "react";
import OrdersContext, { OrdersContextState } from "../OrderContext";
import { Order, OrderItem, Product } from "../../types/db_custom_types";
import { apiFetch } from "@/lib/utils";
import StockContext from "../StockContext";

interface OrdersProviderProps {
  children: ReactNode;
}

const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>([]);
  const [hasContextRan, setHasContextRan] = useState(false);
  const [reRender, setReRender] = useState(false); // State to force re-fetch

  const stockContext = useContext(StockContext);

  if (!stockContext) {
    throw new Error(
      "OrderContextProvider must be used within an StockContextProvider",
    );
  }

  const { products } = stockContext;

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
  }, [reRender]);

  const fetchOrders = () => {
    setReRender((prev) => !prev);
  };

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
    counter: number,
  ) => {
    const order = orders.find((order) => order.order_id === orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const item = order.items.find((item) => item.order_item_id === itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (amount > 0 && product.stock_quantity < counter) {
      console.log("Product: ", product);
      console.log("Counter: ", counter);
      throw new Error("Insufficient stock");
    }

    if (item.quantity + amount < 0) {
      throw new Error("Quantity cannot be less than 0");
    }

    console.log("Updating Locally - updatedItems: ", updatedItems);
    const itemIdx = updatedItems.findIndex(
      (it) => it.order_item_id === item.order_item_id,
    );
    // if (itemIdx === -1 && updatedItems.length > 0) {
    //   throw new Error("Item's Index not found in updatedItems");
    // }

    setOrders((prevOrders) =>
      prevOrders.map((order: Order) => {
        if (order.order_id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item: OrderItem) => {
            if (itemId === item.order_item_id) {
              console.log("I am updating the Item: ", item);
              const updatedItem = {
                ...item,
                quantity: item.quantity + amount,
                price: product.price * (item.quantity + amount),
                counter: counter,
              };

              if (itemIdx === -1) {
                setUpdatedItems([...updatedItems, updatedItem]);
                return updatedItem;
              }
              const updatedItemsCopy = [...updatedItems];
              updatedItemsCopy[itemIdx] = updatedItem;
              setUpdatedItems(updatedItemsCopy);

              return updatedItem;
            }
            return item;
          }),
        };
      }),
    );
  };

  const updateOrderItemDB = async () => {
    if (!updatedItems.length) throw new Error("No items to update");

    console.log(
      "1) [OrderContextProvider]: updateOrderItemDB -> updatedItems: ",
      updatedItems,
    );
    console.log(
      "2) [OrderContextProvider]: updateOrderItemDB -> products: ",
      products,
    );
    try {
      const promises = updatedItems.map((item) => {
        // UPDATING/DELETING -> ORDER ITEM QUANTITY
        if (item.quantity <= 0) {
          // Delete the Order Item Completly
          apiFetch(`/orders/${item.order_id}/items/${item.order_item_id}`, {
            method: "DELETE",
            cache: "no-store",
          });
        } else {
          // Updated it with the new Quantity
          apiFetch(`/orders/${item.order_id}/items/${item.order_item_id}`, {
            method: "PUT",
            body: JSON.stringify(item),
            cache: "no-store",
          });
        }

        // UPDATING -> PRODUCT'S STOCK
        const product = products.find((p) => p.product_id === item.product_id);
        if (!product) {
          throw new Error(
            `[updateOrderItemDB]: Produnt not found, using item -> Item ID: ${item.order_item_id}, Product ID: ${item.product_id}`,
          );
        }

        if (item.counter === undefined) {
          throw new Error(
            "[updateOrderItemDB]: The Item's Counter is undefined",
          );
        }

        // console.log("Old Product: ", product);
        // const newProduct = {
        //   ...product,
        //   stock_quantity: product.stock_quantity - item.counter,
        // };
        // console.log("New Product: ", newProduct);

        apiFetch(`/products/${item.product_id}`, {
          method: "PUT",
          body: JSON.stringify(product),
          cache: "no-store",
        });
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
        fetchOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
