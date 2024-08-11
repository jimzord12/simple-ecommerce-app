"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/showToast";
import confetti from "canvas-confetti";
import { Order } from "@/types/db_custom_types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CartItemType } from "@/types/types";

type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
};

type OrderDetails = {
  order_id: number;
  items: OrderItem[];
  total_items: number;
  total_price: number;
  customer_email: string;
};

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const orderId = id;

  const [cart, setCart, removeCart] = useLocalStorage<{
    items: CartItemType[];
    totalPrice: number;
    totalItems: number;
  }>("cart", {
    items: [],
    totalPrice: -1,
    totalItems: -1,
  });

  const [user] = useLocalStorage<{
    id: number;
    email: string;
    exp: number;
  }>("auth", {
    id: -1,
    email: "",
    exp: -1,
  });

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("The Order ID: ", orderId);
    if (!orderId) {
      showToast("error", "Order ID is missing");
      // router.push("/products");
      return;
    }

    // Simulate fetching order details from an API
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data: Order = await res.json();

        const orderDetails: OrderDetails = {
          order_id: data.order_id,
          items: cart.items.map((item) => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total_items: cart.totalItems,
          total_price: cart.totalPrice,
          customer_email: user.email,
        };
        setOrderDetails(orderDetails);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          showToast("error", error.message || "Error fetching order details");
        } else {
          console.error(error);
          showToast("error", "Error fetching order details");
        }
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [cart.items, cart.totalPrice, orderId, router, user.email]);

  useEffect(() => {
    if (!isLoading && orderDetails) {
      // Trigger confetti after 1 second
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 1000);
    }
  }, [isLoading, orderDetails]);

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-900">
        <div className="container h-full p-8 text-white">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-600">
      <div className="container relative h-full bg-slate-900 p-4 shadow-blurry">
        <div className="border-b-2 border-white px-4 pb-4">
          <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
            Order Details
          </h1>
        </div>

        <div className="mt-4 px-4">
          <h2 className="text-2xl font-semibold text-white">
            Order ID: {orderDetails.order_id}
          </h2>
          <h3 className="mt-4 text-xl text-white">Order Items:</h3>
          <ul className="list-disc pl-8 text-white">
            {orderDetails.items.map((item) => (
              <li key={item.product_id}>
                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg text-white">
            Total Items: {orderDetails.total_items}
          </p>
          <p className="text-lg text-white">
            Total Price: ${orderDetails.total_price.toFixed(2)}
          </p>
        </div>

        <div className="mt-8 px-4">
          <h2 className="text-2xl font-semibold text-white">
            Customer Details
          </h2>
          <p className="mt-2 text-lg text-white">
            Email: {orderDetails.customer_email}
          </p>
        </div>

        <div className="mt-8 px-4">
          <h2 className="text-2xl font-semibold text-white">Thank You!</h2>
          <p className="mt-2 text-lg text-white">
            Your order has been placed successfully. We appreciate your
            business!
          </p>
        </div>

        <div className="mt-8 px-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/products")}
            className="text-white"
          >
            Back to Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
