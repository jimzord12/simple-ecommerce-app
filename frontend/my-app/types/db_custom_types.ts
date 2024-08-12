type ProductCategory =
  | "clothing"
  | "electronic_devices"
  | "houseware"
  | "toys"
  | "books"
  | "sports";

type OrderStatus =
  | "pending"
  | "completed"
  | "shipped"
  | "cancelled"
  | "returned";

interface Product {
  product_id: number;
  product_name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock_quantity: number;
  isStockSufficient?: boolean;
}

interface Order {
  order_id: number;
  customer_id: number;
  order_date: string;
  status: OrderStatus;
  items: OrderItem[];
}

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  counter?: number;
}

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
}

export type {
  ProductCategory,
  OrderStatus,
  Product,
  Order,
  OrderItem,
  Customer,
};
