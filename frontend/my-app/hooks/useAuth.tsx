"use client";

import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useAuth = () => {
  const [user, setUser, removeUser] = useLocalStorage<{
    id: number;
    email: string;
    exp: number;
  }>("auth", {
    id: -1,
    email: "",
    exp: -1,
  });

  const [isAuthed, setIsAuthed] = useState(false);

  function checkAuth(): string | void {
    if (user.id === -1 || user.email === "") {
      console.log("AAAAAAAAA");
      //   showToast("error", "An Account is required to continue");
      //   router.replace("/");
      setIsAuthed(false);
      return "not logged in";
    }

    console.log("Date now: ", Date.now());
    console.log("User exp: ", user.exp);
    console.log("Is (user.exp < Date.now()) True: ", user.exp < Date.now());

    if (user.exp < Date.now()) {
      removeUser();
      //   showToast("warning", "Session Expired, Please Login Again", {
      //     autoClose: false,
      //   });
      //   router.replace("/login");
      setIsAuthed(false);
      return "expired";
    } else {
      setIsAuthed(true);
    }
  }
  return { checkAuth, isAuthed };
};

export default useAuth;
