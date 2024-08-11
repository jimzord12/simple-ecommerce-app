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

export function generateRandomPassword(): string {
  const length = Math.floor(Math.random() * 5) + 8; // Length between 8 and 12
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

async function checkStockBeforeOrder(cartItems: CartItemType[]): Promise<{
  insufficientStockProducts: Product[];
  sufficientStockProducts: Product[];
}> {
  let products: Product[] = [];
  try {
    products = await apiFetch("/products");
  } catch (error) {
    console.error("Error checking stock before order:", error);
    throw error;
  }

  // The Products that derive from the cartItems
  const filteredProducts = products.filter((product: Product) =>
    cartItems.some((item) => item.id === product.product_id),
  );

  // Checking if the stock is sufficient for each product
  const productsWithStockCheck = filteredProducts.map((product: Product) => {
    const relevantCartItem = cartItems.find(
      (item) => item.id === product.product_id,
    );

    if (!relevantCartItem) {
      throw new Error(
        `Cart item not found for product with ID: ${product.product_id}`,
      );
    }

    return {
      ...product,
      isStockSufficient: relevantCartItem.quantity <= product.stock_quantity,
    };
  });

  const insufficientStockProducts = productsWithStockCheck.filter(
    (product: Product) => !product.isStockSufficient,
  );

  const sufficientStockProducts = productsWithStockCheck.filter(
    (product: Product) => product.isStockSufficient,
  );

  return {
    insufficientStockProducts,
    sufficientStockProducts,
  };
}

export async function createOrder(
  customerId: number,
  cartItems: CartItemType[],
) {
  try {
    const { insufficientStockProducts, sufficientStockProducts } =
      await checkStockBeforeOrder(cartItems);

    if (insufficientStockProducts.length > 0) {
      console.log(
        "Some products in your cart have insufficient stock. Please remove them and try again.",
      );
      return {
        insufficientStockProducts,
        sufficientStockProducts,
        success: false,
      };
    }

    const { order_id } = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ customer_id: customerId }),
    });

    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    await Promise.all(
      orderItems.map(async (orderItem) => {
        await apiFetch(`/orders/${order_id}/items`, {
          method: "POST",
          body: JSON.stringify(orderItem),
        });
      }),
    );

    return {
      insufficientStockProducts,
      sufficientStockProducts,
      success: true,
      id: order_id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
