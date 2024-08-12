"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
const inter = Inter({ subsets: ["latin"] });
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useLocalStorage from "@/hooks/useLocalStorage";
import StockContextProvider from "@/context/providers/StockContextProvider";
import CartContextProvider from "@/context/providers/CartContextProvider";
import CustomerProvider from "@/context/providers/CustomerContextProvider";
import OrderContextProvider from "@/context/providers/OrderContextProvider";
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser, removeUser] = useLocalStorage<{
    id: number;
    email: string;
    exp: number;
  }>("auth", {
    id: -1,
    email: "",
    exp: -1,
  });

  useEffect(() => {
    // Check the user's system preference and add the dark class to make the site dark
    // or remove it to make it light
    if (
      // window.matchMedia &&
      // window.matchMedia("(prefers-color-scheme: dark)").matches
      true
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en" className="h-screen">
      <body className={inter.className + " min-h-screen"}>
        <StockContextProvider>
          <CustomerProvider>
            <OrderContextProvider>
              <CartContextProvider>{children}</CartContextProvider>
            </OrderContextProvider>
          </CustomerProvider>
        </StockContextProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
