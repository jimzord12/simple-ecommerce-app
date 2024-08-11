"use client";

import SimpleOrderCard from "@/components/myComps/Cards/SimpleOrderCard";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import OrderContext from "@/context/OrderContext";
import { Order } from "@/types/db_custom_types";

const OrdersPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const orderContext = useContext(OrderContext);

  if (!orderContext) {
    throw new Error("OrdersPage must be used within an OrderContextProvider");
  }

  const { orders, error, isLoading } = orderContext;

  useEffect(() => {
    const msg = checkAuth();
    if (msg === "not logged in") {
      router.replace("/login");
      showToast("error", "You need to login to continue");
    } else if (msg === "expired") {
      router.push("/login");
      showToast("warning", "Session Expired, Please Login Again", {
        autoClose: false,
      });
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-600">
      <div className="container relative min-h-screen bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Orders
            </h1>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <div className="h-4" />
        {isLoading && (
          <div className="h-screen text-center text-2xl text-white">
            One moment, fetching the Orders from Database...
          </div>
        )}
        {!isLoading && orders.length === 0 ? (
          <div className="text-center text-2xl text-white">
            No orders available
          </div>
        ) : (
          orders.map((order: Order) => {
            return (
              <div key={order.order_id} className="ml-4">
                <br />
                <SimpleOrderCard order={order} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
