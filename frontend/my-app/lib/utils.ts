import { Product } from "@/types/db_custom_types";
import { CartItemType } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  try {
    console.log("ApiFetch: ", `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error((await res.text()) || res.statusText);
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  } catch (error: unknown) {
    console.error("Error in apiFetch:", (error as Error).message);
    throw error;
  }
};

export function productToCartItem(product: Product): CartItemType {
  return {
    id: product.product_id,
    name: product.product_name,
    price: product.price,
    quantity: 1,
  };
}

export function alreadyInCart(cartItems: CartItemType[], product: Product) {
  return cartItems.some((item) => item.id === product.product_id);
}
