"use client";

import { Order, OrderItem } from "@/types/db_custom_types";
import { Button } from "../../ui/button";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import StockContext from "@/context/StockContext";
import { useContext, useState } from "react";
import { showToast } from "@/lib/showToast";
import OrderContext from "@/context/OrderContext";

type SimpleOrderItemCardProps = {
  orderItem: OrderItem;
  order: Order;
  // onIncrement: () => void;
  // onDecrement: () => void;
  // onEdit: () => void;
};

const SimpleOrderItemCard: React.FC<SimpleOrderItemCardProps> = ({
  orderItem,
  order,
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

  const { products, isLoading } = stockContext;
  const { orders, updateOrderItemLocally } = orderContext;

  const item = products.find(
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

  if (item === undefined) {
    showToast("error", "Item not Found");
    return null;
  }

  if (actualOrderIdx === -1) {
    showToast("error", "Order Index not Found");
    return null;
  }

  if (actualItemIdx === -1) {
    showToast("error", "Item Index not Found");
    return null;
  }

  const handleIncrement = () => {
    try {
      updateOrderItemLocally(order.order_id, orderItem.order_item_id, 1, item);
      actualItem.stock_quantity -= 1;
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      } else {
        showToast("error", "Failed to increment item");
      }
    }
  };

  const handleDecrement = () => {
    try {
      updateOrderItemLocally(order.order_id, orderItem.order_item_id, -1, item);
      actualItem.stock_quantity += 1;
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
        <h2 className="text-xl text-white">{item?.product_name}</h2>
        <p className="text-sm text-gray-400">
          Quantity: {orders[actualOrderIdx].items[actualItemIdx].quantity} |
          Unit Price: ${item.price.toFixed(2)}
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
