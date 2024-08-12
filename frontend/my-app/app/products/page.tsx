// app/products/page.tsx
"use client";

import SimpleProductCard from "@/components/myComps/Cards/SimpleProductCard";
import { Suspense, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import CartDrawer from "@/components/myComps/Cart/CartDrawer";
import { mockCartItems } from "../../lib/mock/mockingCartItems";
import StockContext from "@/context/StockContext";
import CartContext from "@/context/CartContext";

const ProductsPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const stockContext = useContext(StockContext);
  const cartContext = useContext(CartContext);

  if (!stockContext || !cartContext) {
    throw new Error(
      "ProductsPage must be used within a StockContextProvider and CartContextProvider",
    );
  }

  const { products, setProducts, error, isLoading } = stockContext;
  // const { cartItems, setCartItems } = cartContext;

  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

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

  // useEffect(() => {
  //   console.log("[MOCK] - Cart Items: ", mockCartItems);
  //   setCartItems(mockCartItems);
  // }, []);

  if (error) {
    showToast("error", error);
  }

  return (
    <div className="min-h-screen bg-slate-600">
      <div className="container relative min-h-screen bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Products
            </h1>
            <Link href="/products/add">
              <Button
                variant="outline"
                size="lg"
                className="absolute right-8 top-32"
              >
                Add Product
              </Button>
            </Link>
          </div>
          <div className="flex gap-6">
            <CartDrawer />
            <UserAvatar />
          </div>
        </div>
        <div className="h-4" />
        {isLoading && (
          <div className="h-screen text-center text-2xl text-white">
            One moment, fetching the Products from Database...
          </div>
        )}
        {!isLoading && products.length === 0 ? (
          <div className="text-center text-2xl text-white">
            No products available
          </div>
        ) : (
          products.map((product) => {
            return (
              <div key={product.product_id} className="ml-4">
                <br />
                <SimpleProductCard productCopy={product} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
