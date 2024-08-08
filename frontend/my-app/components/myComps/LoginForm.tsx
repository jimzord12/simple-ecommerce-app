"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginForm = ({}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "example@company.com",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const myHandleSumbit = async (values: z.infer<typeof formSchema>) => {
    if (error) {
      setError("");
    }

    console.log(values);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    console.log("Error", data);

    if (data?.success == undefined) {
      console.log("Login Failed", data.error);
      setError("Login Failed, " + data.error.message);
    }

    if (response.ok && data.success) {
      console.log("Login Success");
      setIsSuccess(true);
      router.push("/products");
    }
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      {isSuccess && <div className="text-emerald-500">{error}</div>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myHandleSumbit)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          <Button className="mt-2 w-1/2" type="submit">
            {isSuccess ? "Welcome Back" : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
