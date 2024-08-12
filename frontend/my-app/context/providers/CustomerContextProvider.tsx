"use client";

import { useState, FC, useEffect } from "react";
import CustomerContext, { CustomerContextState } from "../CustomerContext";
import { Customer } from "../../types/db_custom_types";

// Define the initial state
const initialState: CustomerContextState = [] as Customer[];

const CustomerProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] =
    useState<CustomerContextState>(initialState);
  const [reRender, setReRender] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Fetching customers");
        const res = await fetch("/api/customers");
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await res.json();
        console.log("The Customers: ", data);
        setCustomers(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [reRender]);

  const fetchCustomers = () => {
    setReRender((prev) => !prev);
  };

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
        error,
        setError,
        isLoading,
        // setIsLoading,
        fetchCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
