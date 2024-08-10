"use client";

import { useState, useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { FaUserCircle } from "react-icons/fa";

const UserAvatar = () => {
  const [user, setUser, removeUser] = useLocalStorage<{
    id: number;
    email: string;
    exp: number;
  }>("auth", {
    id: -1,
    email: "",
    exp: -1,
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Mark that the component has been hydrated
  }, []);

  if (!isHydrated) {
    // Optionally, return null or a loading state until hydration is complete
    return null;
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border-2 p-4">
      <FaUserCircle color="white" size={32} />
      <p className="text-2xl">{user.email}</p>
    </div>
  );
};

export default UserAvatar;
