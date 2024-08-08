"use client";

import Link from "next/link";
import { Product, ProductCategory } from "../../../types/db_custom_types";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const EditProductPage = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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
        throw new Error(`Failed to create product: ${errorData.error}`);
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="p-2">
      <h1 className=" text-4xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
        Updating Product: {product?.product_name}
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {success && (
        <div style={{ color: "green", fontWeight: "bold" }}>
          Product updated successfully!
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 max-w-[380px]"
      >
        <div className="p-4 ">
          <label className="flex justify-between">
            Name:
            <input
              type="text"
              value={name || "error"}
              onChange={(e) => setName(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800 max-w-[190px]"
            />
          </label>
        </div>
        <div className="p-4 ">
          <label className="flex justify-between">
            Description:
            <textarea
              value={description || "error"}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800 max-w-[190px]"
            />
          </label>
        </div>
        <div className="p-4 ">
          <label className="flex justify-between">
            Category:
            <select
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              value={category || ""}
              required
              className="ml-4 dark:bg-gray-800 max-w-[190px]"
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
        <div className="p-4 ">
          <label className="flex justify-between">
            Stock:
            <input
              type="number"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800 max-w-[190px]"
            />
          </label>
        </div>
        <div className="p-4 ">
          <label className="flex justify-between">
            Price:
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800 max-w-[190px]"
            />
          </label>
        </div>
        <div className="flex flex-col gap-6 ml-16">
          <button
            type="submit"
            className="text-2xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text w-fit border-2 border-emerald-400 rounded-lg p-4 hover:scale-110 transition-transform hover:-rotate-12"
          >
            Update Product
          </button>
          <Link href="/products">
            <button
              type="submit"
              className="text-2xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text w-fit border-2 border-emerald-400 rounded-lg p-4 hover:scale-110 transition-transform hover:rotate-12"
            >
              Back to Products
            </button>
          </Link>
          <Link href="/">
            <button
              type="submit"
              className="text-2xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text w-fit border-2 border-emerald-400 rounded-lg p-4 hover:scale-110 transition-transform hover:-rotate-12"
            >
              Back to Home
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
