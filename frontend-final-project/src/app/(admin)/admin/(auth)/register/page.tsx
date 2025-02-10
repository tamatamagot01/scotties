"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userRegister } from "@/apis/user";
import { useUserStore } from "@/store/zustand";

function Register() {
  const { roleId } = useUserStore();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  if (roleId !== 2 && roleId !== 3) {
    router.replace("/");
  } else {
    setIsLoading(false);
  }

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const thisUser = { ...user, roleId: 2 };
      const res = await userRegister(thisUser);
      alert(res.data.message);
    } catch (error: any) {
      console.error("Error: ", error);
      alert(error.response.data.error as string);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  return (
    <div className="relative bg-indigo-100 flex justify-center items-center min-h-screen w-full">
      <Link
        className="absolute top-3 right-2 text-xs bg-black text-white rounded-xl px-2 py-1"
        href={"/admin/dashboard"}
      >
        Back to dashboard
      </Link>
      <div>
        <div className="text-xl">Admin Registration Form</div>
        <form
          className="flex flex-col justify-center items-center gap-2 mt-3"
          onSubmit={handleSubmit}
        >
          <input
            className="px-3 py-1 rounded-md"
            type="text"
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) =>
              setUser((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
          />
          <input
            className="px-3 py-1 rounded-md"
            type="text"
            placeholder="Last Name"
            value={user.lastName}
            onChange={(e) =>
              setUser((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
          />
          <input
            className="px-3 py-1 rounded-md"
            type="text"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <input
            className="px-3 py-1 rounded-md"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <button className="bg-black text-white rounded-xl px-3 mt-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
