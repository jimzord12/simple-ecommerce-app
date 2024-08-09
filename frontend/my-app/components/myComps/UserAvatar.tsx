"use client";

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
  return (
    <div className="flex gap-4 items-center p-4 border-2 rounded-xl">
      <FaUserCircle color="white" size={32} />
      <p className="text-2xl">{user.email}</p>
    </div>
  );
};

export default UserAvatar;
