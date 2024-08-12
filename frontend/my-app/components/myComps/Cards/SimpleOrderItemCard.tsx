"use client";

import { Order, OrderItem } from "@/types/db_custom_types";
import { Button } from "../../ui/button";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import StockContext from "@/context/StockContext";
import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { showToast } from "@/lib/showToast";
import OrderContext from "@/context/OrderContext";

type SimpleOrderItemCardProps = {
  orderItem: OrderItem;
  order: Order;
  counters: { id: number; counter: number }[];
  setCounters: Dispatch<SetStateAction<{ id: number; counter: number }[]>>;
  // onIncrement: () => void;
  // onDecrement: () => void;
  // onEdit: () => void;
};

const SimpleOrderItemCard: React.FC<SimpleOrderItemCardProps> = ({
  orderItem,
  order,
  counters,
  setCounters,
  // onIncrement,
  // onDecrement,
  // onEdit,
}) => {
  const stockContext = useContext(StockContext);
  const orderContext = useContext(OrderContext);

  if (!stockContext || !orderContext) {
    throw new Error(
      "SimpleOrderItemCard must be used within a StockContextProvider",
    );
  }

  const incrementCalled = useRef(0);
  const decrementCalled = useRef(0);

  const { products, isLoading, decreaseStockBy, increaseStockBy } =
    stockContext;
  const { orders, updateOrderItemLocally } = orderContext;

  const productItem = products.find(
    (product) => product.product_id === orderItem.product_id,
  );

  const itemIdx = products.findIndex(
    (product) => product.product_id === orderItem.product_id,
  );

  const actualItem = products[itemIdx];

  const actualOrderIdx = orders.findIndex(
    (ord) => ord.order_id === order.order_id,
  );

  console.log("Actual Order Index: ", actualOrderIdx);

  const actualItemIdx = order?.items.findIndex(
    (oi) => oi.order_item_id === orderItem.order_item_id,
  );

  if (productItem === undefined) {
    showToast("error", "Item not Found");
    return null;
  }

  if (actualItemIdx === -1) {
    showToast("error", "Item Index not Found");
    return null;
  }

  if (orders[actualOrderIdx].items === null) {
    showToast("error", "Order Items not Found");
    return null;
  }

  const handleIncrement = () => {
    incrementCalled.current += 1;

    console.log("[Increment Qnt]: Counters: ", counters);
    console.log("[Increment Qnt]: Ref: ", incrementCalled.current);

    const counterIdx = counters.findIndex(
      (c) => c.id === orderItem.order_item_id,
    );
    if (counterIdx === -1) {
      throw new Error("Counter not found");
    }
    try {
      updateOrderItemLocally(
        order.order_id,
        orderItem.order_item_id,
        1,
        productItem,
        counters[counterIdx].counter + 1,
      );
      decreaseStockBy(actualItem.product_id, 1);
      setCounters((prev) => {
        const newCounters = [...prev];
        newCounters[counterIdx].counter += 1;
        return newCounters;
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Failed to increment item");
      }
    }
  };

  const handleDecrement = () => {
    decrementCalled.current += 1;

    console.log("[Decrement Qnt]: Counters: ", counters);
    console.log("[Decrement Qnt]: Ref: ", decrementCalled.current);
    const counterIdx = counters.findIndex(
      (c) => c.id === orderItem.order_item_id,
    );
    if (counterIdx === -1) {
      throw new Error("Counter not found");
    }
    try {
      updateOrderItemLocally(
        order.order_id,
        orderItem.order_item_id,
        -1,
        productItem,
        counters[counterIdx].counter - 1,
      );
      increaseStockBy(actualItem.product_id, 1);

      setCounters((prev) => {
        const newCounters = [...prev];
        newCounters[counterIdx].counter -= 1;
        return newCounters;
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Failed to decrement item");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (orders[actualOrderIdx].items[actualItemIdx].quantity <= 0) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-700 bg-opacity-45 p-4">
      <div>
        <h2 className="text-xl text-white">{productItem?.product_name}</h2>
        <p className="text-sm text-gray-400">
          Quantity: {orders[actualOrderIdx].items[actualItemIdx].quantity} |
          Unit Price: ${productItem.price.toFixed(2)} | Difference:{" "}
          {
            counters.find((oi) => {
              console.log("Counters: ", counters);
              console.log("CounterItem: ", oi);
              console.log("Order Item: ", orderItem);
              console.log("Condition: ", oi.id === orderItem.order_item_id);
              return oi.id === orderItem.order_item_id;
            })?.counter
          }
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleIncrement}>
          <FiPlus />
        </Button>
        <Button variant="outline" size="icon" onClick={handleDecrement}>
          {orders[actualOrderIdx].items[actualItemIdx].quantity === 1 ? (
            <MdDeleteForever color="red" size={32} />
          ) : (
            <FiMinus />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimpleOrderItemCard;
