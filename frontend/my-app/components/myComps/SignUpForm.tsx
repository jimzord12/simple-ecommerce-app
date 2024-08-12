"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpFormProps = {};

const formSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string().min(3),
    last_name: z.string().min(3),
    password: z.string().min(8),
    passwordConfirm: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    { message: "Passwords do not match", path: ["passwordConfirm"] },
  );

const SignUpForm = ({}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const myHandleSumbit = async (values: z.infer<typeof formSchema>) => {
    if (error) {
      setError("");
    }

    console.log(values);
    delete values.passwordConfirm;

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.status === 500) {
      setError("Register Failed, please again late");
    }

    if (response.status === 409) {
      setError("User already exists");
    }

    const data = await response.json();

    if (response.ok) {
      console.log("Login Success");
      setIsSuccess(true);
      sessionStorage.setItem("previousUrl", window.location.href);
      router.push("/login");
    }
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      {isSuccess && (
        <div className="text-emerald-500">Successful Registration</div>
      )}
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
            name="first_name"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your first name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your last name"
                      type="text"
                      {...field}
                    />
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

          <FormField
            name="passwordConfirm"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password Confirm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password confirm"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          <div className="flex gap-6">
            <Button className="mt-2 w-1/2" type="submit">
              Register Now
            </Button>
            <Button
              className="mt-2 w-1/2"
              variant="secondary"
              type="button"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
