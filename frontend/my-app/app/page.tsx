"use client";

import UserAvatar from "@/components/myComps/UserAvatar";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { showToast } from "@/lib/showToast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { checkAuth, isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const msg = checkAuth();
    if (msg === "not logged in") {
      // showToast("error", "An Account is required to continue");
      return;
    } else if (msg === "expired") {
      showToast("warning", "Session Expired, Please Login Again", {
        autoClose: false,
      });
      // router.replace("/login");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="peer/auth z-10 order-1 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Check out the repo at:&nbsp;
          <a
            href={process.env.NEXT_PUBLIC_GITHUB_REPO_URL}
            className="hover text-blue-600 transition-transform hover:-rotate-12 hover:scale-150"
          >
            <code className="font-mono font-bold">GitHub</code>
          </a>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          {isAuthed ? (
            <UserAvatar />
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button className="p-4 text-xl" variant="default" size="lg">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="p-4 text-xl" variant="secondary" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="peer/crud order-3 mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <Link href="/products">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Products{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              View, Add, Edit, and Delete products.
            </p>
          </div>
        </Link>

        <Link href="/customers">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Customers{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              View, Add, Edit, and Delete customers.
            </p>
          </div>
        </Link>

        <Link href="/orders">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              Orders{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              View, Add, Edit, and Delete orders.
            </p>
          </div>
        </Link>
      </div>

      <div className="before:bg-gradient-radial after:bg-gradient-conic relative z-[99] order-2 flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] peer-hover/auth:animate-bounce peer-hover/crud:animate-pulse before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/imgs/e-commerce-img.png"
          alt="Next.js Logo"
          width={360}
          height={180}
          priority
        />
      </div>
    </main>
  );
}
