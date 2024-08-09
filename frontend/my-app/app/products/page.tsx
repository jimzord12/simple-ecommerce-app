// app/products/page.tsx
"use client";

import SimpleProductCard from "@/components/myComps/SimpleProductCard";
import { Product } from "../../types/db_custom_types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/myComps/UserAvatar";
import Cart from "@/components/myComps/Cart/CartIcon";
import CartDrawer from "@/components/myComps/Cart/CartDrawer";

const ProductsPage = () => {
  const { checkAuth } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    const fetchProducts = async () => {
      try {
        console.log("Fetching products");
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex justify-between gap-4 min-w-[25%] max-w-[416px]">
          <h1 className=" text-4xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
            Products
          </h1>
          <Link href="/products/add">
            <Button variant="outline" size="lg" className="">
              Add Product
            </Button>
          </Link>
        </div>
        <div className="flex gap-6">
          <CartDrawer
            products={[
              {
                category: "electronic_devices",
                description: "A nice product",
                price: 100,
                product_id: 1,
                product_name: "Product 1",
                stock_quantity: 10,
              } as Product,
              {
                category: "electronic_devices",
                description: "A nice product",
                price: 100,
                product_id: 1,
                product_name: "Product 1",
                stock_quantity: 10,
              } as Product,
            ]}
          />
          <UserAvatar />
        </div>
      </div>
      {products.map((product) => {
        return (
          <div key={product.product_id} className="ml-4">
            <br />
            <SimpleProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductsPage;
