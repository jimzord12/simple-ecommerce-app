"use client";

import SimpleCartItemCard from "@/components/myComps/Cards/SimpleCartItemCard"; // This will be similar to SimpleProductCard
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import CartContext, { CartContextType } from "@/context/CartContext";
import { createOrder } from "@/lib/utils"; // Ensure this path is correct
import useLocalStorage from "@/hooks/useLocalStorage";
import { CartItemType } from "@/types/types";

const CheckoutPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const [user] = useLocalStorage<{
    id: number;
    email: string;
    exp: number;
  }>("auth", {
    id: -1,
    email: "",
    exp: -1,
  });

  const [cart, setCart, removeCart] = useLocalStorage<{
    items: CartItemType[];
    totalPrice: number;
    totalItems: number;
  }>("cart", {
    items: [],
    totalPrice: -1,
    totalItems: -1,
  });

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CheckoutPage must be used within a CartContextProvider");
  }

  const { cartItems, setCartItems, getTotalPrice } = cartContext;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const msg = checkAuth();
    if (msg === "not logged in") {
      router.replace("/");
      showToast("error", "You need to login to continue");
    } else if (msg === "expired") {
      router.push("/login");
      showToast("warning", "Session Expired, Please Login Again", {
        autoClose: false,
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleCreateOrder = async () => {
    try {
      const {
        success,
        id,
        insufficientStockProducts,
        sufficientStockProducts,
      } = await createOrder(user.id, cartItems);
      if (!success || insufficientStockProducts.length > 0) {
        showToast(
          "error",
          "Some items in your cart have insufficient stock. Please adjust your cart and try again.",
        );
        alert(...insufficientStockProducts);
      } else {
        showToast("success", "Order created successfully!");
        const totalPrice = cartItems.reduce(
          (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
          0,
        );
        const totalItems = cartItems.reduce(
          (sum, currentItem) => sum + currentItem.quantity,
          0,
        );
        setCart({ items: cartItems, totalPrice, totalItems });
        setCartItems([]); // Clear the cart after successful order creation
        router.push(`/order-details/${id}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showToast("error", "Failed to create the order. Please try again.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-full bg-slate-600">
      <div className="container relative min-h-screen bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Checkout
            </h1>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <div className="h-4" />
        {isLoading ? (
          <div className="text-center text-2xl text-white">
            Loading your cart items...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-2xl text-white">
            Your cart is empty.
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="ml-4">
                <br />
                <SimpleCartItemCard cartItem={item} />
              </div>
            ))}
            <div className="flex justify-between">
              <div>
                <h2 className="ml-4 mt-4 text-2xl font-light text-white">
                  Total Price:{" "}
                  <span className="font-semibold">
                    {" "}
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </h2>
              </div>
              <div className="mt-4 flex flex-col items-end gap-4">
                <div>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleCreateOrder}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Confirm and Create Order
                  </Button>
                </div>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Back to Products
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

export default CheckoutPage;
