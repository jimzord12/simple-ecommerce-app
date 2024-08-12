"use client";

import Link from "next/link";
import { Product, ProductCategory } from "../../../types/db_custom_types";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/myComps/UserAvatar";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import StockContext from "@/context/StockContext";

const EditProductPage = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { checkAuth } = useAuth();

  const stockContext = useContext(StockContext);

  if (!stockContext) {
    throw new Error("ProductsPage must be used within a StockContextProvider");
  }

  const { fetchProducts } = stockContext;

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
    async function fetchProduct() {
      const url = `/api/products/edit/${id}`;
      console.log("Fetching product from: ", url);
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        setError("Failed to fetch product");
        return;
      }

      const data = await res.json();
      setProduct(data);

      setName(data.product_name);
      setDescription(data.description);
      setCategory(data.category);
      setStock(data.stock_quantity.toString());
      setPrice(data.price.toString());
    }

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/products/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          product_name: name,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock),
          category,
        }),
      });

      if (!res.ok) {
        console.log(await res.text());
        const errorData = await res.json(); // Extract error details
        throw new Error(`Failed to update product: ${errorData.error}`);
      }

      setSuccess(true);
      fetchProducts();
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="h-screen bg-slate-600">
      <div className="container relative h-full bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Update Product
            </h1>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <main className="relative mt-4 rounded-lg border-2 border-white border-opacity-50 p-4">
          <div className="absolute right-4 top-4 flex flex-col items-end gap-4">
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
          {success && (
            <div style={{ color: "green" }}>Product updated successfully!</div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex max-w-[380px] flex-col gap-3"
          >
            <div className="flex">
              <div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Name:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Description:
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Category:
                    <select
                      onChange={(e) =>
                        setCategory(e.target.value as ProductCategory)
                      }
                      value={category}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    >
                      <option value="">Select a category</option>
                      <option value="electronic_devices">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="houseware">Homeware</option>
                      <option value="sports">Sports</option>
                      <option value="books">Books</option>
                      <option value="toys">Toys</option>
                    </select>
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Stock:
                    <input
                      type="number"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Price:
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 inline-block rounded-lg border-2 border-emerald-400 bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text p-4 text-2xl text-transparent transition-transform hover:-rotate-12 hover:scale-110"
                >
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProductPage;
