"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/myComps/UserAvatar";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { set } from "zod";

const EditCustomerPage = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const [customer, setCustomer] = useState<any | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();
  const { checkAuth } = useAuth();

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
    async function fetchCustomer() {
      const url = `/api/customers/edit/${id}`;
      console.log("Fetching customer from: ", url);
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        setError("Failed to fetch customer");
        return;
      }

      const data = await res.json();
      setCustomer(data);

      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setPhone(data.phone);
    }

    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    setError("");
    setSuccess(false);
    e.preventDefault();

    try {
      const res = await fetch(`/api/customers/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(`Failed to update customer: ${error}`);
      }

      showToast("success", "Customer updated successfully!");
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
      showToast("error", error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="h-screen bg-slate-600">
      <div className="container relative h-full bg-slate-900 p-4 shadow-blurry">
        <div className="flex justify-between border-b-2 border-white px-4 pb-4">
          <div className="flex min-w-[25%] max-w-[416px] items-center justify-between gap-4">
            <h1 className="inline-block bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent">
              Update Customer
            </h1>
          </div>
          <div className="flex gap-6">
            <UserAvatar />
          </div>
        </div>
        <main className="relative mt-4 rounded-lg border-2 border-white border-opacity-50 p-4">
          <div className="absolute right-4 top-4 flex flex-col items-end gap-4">
            <Link href="/customers">
              <Button>Back to Customers</Button>
            </Link>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
          {success && (
            <div style={{ color: "green" }}>Customer updated successfully!</div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex max-w-[380px] flex-col gap-3"
          >
            <div className="flex">
              <div>
                <div className="p-4">
                  <label className="flex justify-between">
                    First Name:
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Last Name:
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <div className="p-4">
                  <label className="flex justify-between">
                    Email:
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="ml-4 w-[250px] dark:bg-gray-800"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 inline-block rounded-lg border-2 border-emerald-400 bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 bg-clip-text p-4 text-2xl text-transparent transition-transform hover:-rotate-12 hover:scale-110"
                >
                  Update Customer
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditCustomerPage;