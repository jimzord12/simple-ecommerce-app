"use client";

import SimpleOrderItemCard from "@/components/myComps/Cards/SimpleOrderItemCard"; // Similar to SimpleCartItemCard but for order items
import { use, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter, useSearchParams } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import OrderContext from "@/context/OrderContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { OrderItem } from "@/types/db_custom_types";
import confetti from "canvas-confetti";

const EditOrdersPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[] | null>(null);

  const params = useSearchParams();
  const id = params.get("id");

  console.log("From Params: Order ID: ", id);

  const orderContext = useContext(OrderContext);

  if (!orderContext) {
    throw new Error(
      "EditOrdersPage must be used within an OrderContextProvider",
    );
  }

  const { orders, getOrderItems, isLoading, updateOrderItemDB, hasContextRan } =
    orderContext;
  console.log("All the Orders: ", orders);
  const order = orders.find((order) => order.order_id === Number(id));
  console.log("The Orders: ", order);

  const [error, setError] = useState<string | null>(null);
  const [isItemsLoading, setIsItemsLoading] = useState(true);

  useEffect(() => {
    if (!hasContextRan) {
      return;
    }

    // const order = orders.find((order) => order.order_id === Number(id));
    // console.log("The Order: ", order);

    if (!order) {
      setError("Order not found");
      showToast("error", "Order not found");
      setIsItemsLoading(false);
      return;
    }

    async function fethcOrderItems() {
      try {
        const orderItems = await getOrderItems(order!);
        setOrderItems(orderItems);
        setIsItemsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch order items");
        setIsItemsLoading(false);
      }
    }
    fethcOrderItems();
  }, [getOrderItems, hasContextRan, id, order, orders, orders.length]);

  useEffect(() => {
    if (!hasContextRan) {
      return;
    }

    const msg = checkAuth();
    if (msg === "not logged in") {
      router.replace("/");
      showToast("error", "You need to login to continue");
    } else if (msg === "expired") {
      router.push("/login");
      showToast("warning", "Session Expired, Please Login Again", {
        autoClose: false,
      });
    }
  }, [checkAuth, hasContextRan, router]);

  const handleUpdateOrder = async () => {
    try {
      // Implement your logic to update the order here.
      await updateOrderItemDB();
      showToast("success", "Order updated successfully!");

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0, x: 1.1 },
        angle: 180,
      });

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0, x: -0.15 },
        angle: 0,
      });

      // router.push(`/order-details/${id}`);
    } catch (error) {
      console.error("Error updating order:", error);
      showToast("error", "Failed to update the order. Please try again.");
    }
  };

  if (!order && hasContextRan) {
    // router.push("/orders");
    return (
      <div className="flex h-screen items-center justify-center text-3xl font-semibold">
        Order not found. Redirecting to Orders page...
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="flex h-screen items-center justify-center text-3xl font-semibold">
        Error: {error}
      </div>
    );
  }

  let actualOrderIdx;

  if (!hasContextRan || isItemsLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-800 text-3xl font-semibold">
        Loading...
      </div>
    );
  } else {
    if (order === undefined) {
      showToast("error", "Order Index not Found");
      setError("Order not found");
      return null;
    } else {
      actualOrderIdx = orders.findIndex(
        (ord) => ord.order_id === order.order_id,
      );
    }

    console.log("After Context: Order: ", order);
    console.log("After Context: Actual Order Index: ", actualOrderIdx);
    console.log("After Context: orderItems: ", orderItems);

    if (actualOrderIdx === -1 || actualOrderIdx === undefined) {
      showToast("error", "Order Index not Found");
      setError("Order Index not Found");
      return null;
    }

    if (!orderItems) {
      showToast("error", "Order Index not Found");
      setError("Order Items not Found");
      return null;
    }
  }

  return (
    <div className="h-full bg-slate-600">
      <div className="container relative min-h-screen bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Edit Order
            </h1>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <div className="h-4" />
        {isLoading || isItemsLoading ? (
          <div className="text-center text-2xl text-white">
            Loading your order items...
          </div>
        ) : orderItems.length === 0 ? (
          <div className="text-center text-2xl text-white">
            Your order is empty.
          </div>
        ) : (
          <>
            {orderItems.map((item, idx) => (
              <div key={item.order_id + idx}>
                {/* <br /> */}
                <SimpleOrderItemCard
                  orderItem={item}
                  order={order}
                  key={item.order_id}
                />
              </div>
            ))}
            <div className="flex justify-between">
              <div>
                <h2 className="ml-4 mt-4 text-2xl font-light text-white">
                  Total Price:{" "}
                  <span className="font-semibold">
                    $
                    {orders[actualOrderIdx].items
                      .reduce((sum, currentItem) => sum + currentItem.price, 0)
                      .toFixed(2)}
                  </span>
                </h2>
              </div>
              <div className="mt-4 flex flex-col items-end gap-4">
                <div>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleUpdateOrder}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Confirm and Update Order
                  </Button>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="lg">
                    Back to Orders
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditOrdersPage;
