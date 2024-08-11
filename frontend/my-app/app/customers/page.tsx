"use client";

import SimpleCustomerCard from "@/components/myComps/Cards/SimpleCustomerCard";
import { Suspense, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import CartDrawer from "@/components/myComps/Cart/CartDrawer";
import { mockCartItems } from "../../lib/mock/mockingCartItems";
import CustomerContext from "@/context/CustomerContext";
import CartContext from "@/context/CartContext";
import { Customer } from "@/types/db_custom_types";

const CustomersPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const customerContext = useContext(CustomerContext);
  const cartContext = useContext(CartContext);

  if (!customerContext || !cartContext) {
    throw new Error(
      "CustomersPage must be used within a CustomerContextProvider and CartContextProvider",
    );
  }

  const { customers, setCustomers } = customerContext;
  const { cartItems, setCartItems } = cartContext;

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
    }
  }, []);

  useEffect(() => {
    console.log("Cart Items: ", cartItems);
    const fetchCustomers = async () => {
      try {
        console.log("Fetching customers");
        const res = await fetch("/api/customers");
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await res.json();
        console.log("The Customers: ", data);
        setCustomers(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log("[MOCK] - Cart Items: ", mockCartItems);
    setCartItems(mockCartItems);
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
              Customers
            </h1>
            <Link href="/customers/add">
              <Button
                variant="outline"
                size="lg"
                className="absolute right-8 top-32"
              >
                Add Customer
              </Button>
            </Link>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <div className="h-4" />
        {isLoading && (
          <div className="h-screen text-center text-2xl text-white">
            One moment, fetching the Customers from Database...
          </div>
        )}
        {!isLoading && customers.length === 0 ? (
          <div className="h-screen text-center text-2xl text-white">
            No customers available
          </div>
        ) : (
          customers.map((customer: Customer) => {
            return (
              <div key={customer.customer_id} className="ml-4">
                <br />
                <SimpleCustomerCard customer={customer} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
