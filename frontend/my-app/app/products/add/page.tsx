"use client";

import { ProductCategory } from "../../../types/db_custom_types";
import { useState } from "react";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/products", {
        method: "POST",
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

      setName("");
      setDescription("");
      setCategory("");
      setStock("");
      setPrice("");
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {success && (
        <div style={{ color: "green" }}>Product added successfully!</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="p-4">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800"
            />
          </label>
        </div>
        <div className="p-4">
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800"
            />
          </label>
        </div>
        <div className="p-4">
          <label>
            Category:
            <select
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              value={category}
              required
              className="ml-4 dark:bg-gray-800"
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
          <label>
            Stock:
            <input
              type="number"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800"
            />
          </label>
        </div>
        <div className="p-4">
          <label>
            Price:
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="ml-4 dark:bg-gray-800"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-2xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text w-fit border-2 border-emerald-400 rounded-lg p-4 hover:scale-110 transition-transform hover:-rotate-12"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
