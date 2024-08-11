"use client";

import { createContext } from "react";
import type { Customer } from "../types/db_custom_types";

export type CustomerContextState = Customer[] | [];

// Define the type for your context
export interface CustomerContextType {
  customers: CustomerContextState;
  setCustomers: React.Dispatch<React.SetStateAction<CustomerContextState>>;
  addCustomer: (customer: Customer) => void;
  removeCustomer: (customer: Customer) => void;
  updateCustomer: (updatedCustomer: Customer) => void;
}

// Create the context with default values (use `undefined` initially)
const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

export default CustomerContext;
