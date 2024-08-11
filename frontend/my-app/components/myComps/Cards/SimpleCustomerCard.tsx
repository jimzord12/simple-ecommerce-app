"use client";

import { Customer } from "@/types/db_custom_types";
import React from "react";
import { Button } from "../../ui/button";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/showToast";

type SimpleCustomerCardProps = {
  customer: Customer;
};

const SimpleCustomerCard: React.FC<SimpleCustomerCardProps> = ({
  customer,
}) => {
  const router = useRouter();

  async function handleCustomerDelete() {
    const res = await fetch(`/api/customers/delete/${customer.customer_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("error", "Failed to delete customer");
    } else {
      showToast("success", "Customer deleted successfully");
    }

    router.refresh();
  }

  return (
    <div className="flex min-w-[25%] max-w-[550px] items-center gap-8 rounded-lg bg-zinc-700 bg-opacity-45 p-4">
      <div className="w-[85%]">
        <h2 className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">First Name: </span>
          <span className="inline-flex w-fit">{customer.first_name}</span>
        </h2>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Last Name: </span>
          <span className="inline-flex w-fit text-end">
            {customer.last_name}
          </span>
        </p>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">ID: </span>
          <span className="inline-flex w-fit text-end">
            {customer.customer_id}
          </span>
        </p>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Email: </span>
          <span className="inline-flex w-fit overflow-x-auto">
            {customer.email}
          </span>
        </p>
        <p className="inline-flex w-full items-end justify-between">
          <span className="inline-flex w-[100px]">Created: </span>
          <span className="inline-flex w-fit text-end">
            {new Date(customer.created_at).toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="mr-6 flex w-[15%] flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Link href={`/customers/edit?id=${customer.customer_id}`}>
            <Button variant="outline" size="icon">
              <MdEditSquare color="white" size={24} />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleCustomerDelete}>
            <MdDeleteForever color="red" size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleCustomerCard;
