"use client";

import { Order } from "@/types/db_custom_types";
import React from "react";
import { Button } from "../../ui/button";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/showToast";

type SimpleOrderCardProps = {
  order: Order;
};

const SimpleOrderCard: React.FC<SimpleOrderCardProps> = ({ order }) => {
  const router = useRouter();

  async function handleOrderDelete() {
    const res = await fetch(`/api/orders/delete/${order.order_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("error", "Failed to delete order");
    } else {
      showToast("success", "Order deleted successfully");
    }

    router.refresh();
  }

  return (
    <div className="flex min-w-[25%] max-w-[550px] items-center gap-8 rounded-lg bg-zinc-700 bg-opacity-45 p-4">
      <div className="w-[85%]">
        <h2 className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Order ID: </span>
          <span className="inline-flex w-fit">{order.order_id}</span>
        </h2>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Customer ID: </span>
          <span className="inline-flex w-fit text-end">
            {order.customer_id}
          </span>
        </p>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Status: </span>
          <span className="inline-flex w-fit text-end">{order.status}</span>
        </p>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Order Date: </span>
          <span className="inline-flex w-fit text-end">
            {new Date(order.order_date).toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="mr-6 flex w-[15%] flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Link href={`/orders/edit?id=${order.order_id}`}>
            <Button variant="outline" size="icon">
              <MdEditSquare color="white" size={24} />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleOrderDelete}>
            <MdDeleteForever color="red" size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleOrderCard;
