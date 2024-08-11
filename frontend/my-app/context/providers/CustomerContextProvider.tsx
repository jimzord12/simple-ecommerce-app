"use client";

import { useState, FC } from "react";
import CustomerContext, { CustomerContextState } from "../CustomerContext";
import { Customer } from "../../types/db_custom_types";

// Define the initial state
const initialState: CustomerContextState = [] as Customer[];

const CustomerProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] =
    useState<CustomerContextState>(initialState);

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const removeCustomer = (customer: Customer) => {
    setCustomers((prev) =>
      prev.filter((c) => c.customer_id !== customer.customer_id),
    );
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.customer_id === updatedCustomer.customer_id
          ? updatedCustomer
          : customer,
      ),
    );
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        addCustomer,
        removeCustomer,
        updateCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
