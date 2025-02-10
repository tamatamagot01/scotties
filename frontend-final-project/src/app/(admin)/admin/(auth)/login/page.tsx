/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Input from "../component/Input";
import Image from "next/image";
import { login, logout } from "@/apis/user";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/zustand";

export default function Login() {
  const { roleId } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (roleId === 2 || roleId == 3) {
      router.push("/admin/dashboard");
    }
  }, [roleId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const res = await login({ email, password });
      const role = res.data.roleId;

      // หาก role ไม่ใช่ 2 (admin) และ 3 (manager) จะถูกเตะไปหน้า root
      if (role !== 2 && role !== 3) {
        logout(); // ใช้ function logout เพื่อลบ cookie ที่ถูก set จาก function login ทิ้ง
        alert("You don't have permission to access this area");
        router.replace("/");
      } else {
        // หาก role เป็น 2 (admin) และ 3 (manager) จะเข้าหน้า admin dashboard ได้
        alert(res.data.message);
        router.replace("/admin/dashboard");
      }
    } catch (error) {
      setError((error as any).response.data.error);
      console.error("Error: ", error);
    }
  };

  return (
    // mobile-size
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-slate-200">
      <div className="absolute top-10 flex justify-center items-center">
        <Image
          className="w-full h-10 mt-20"
          src="/assets/decorations/logo-3-admin.png"
          alt="scotties-logo"
          width={0}
          height={0}
          sizes="100vw"
        />
      </div>
      <div className="w-10/12 sm:flex flex-col justify-center items-center">
        <h1 className="w-fit bg-slate-300 ml-6 px-3 py-1 rounded-t-md sm:w-1/4 sm:flex justify-center">
          Admin
        </h1>
        <form
          className="bg-slate-300 flex flex-col px-5 rounded-md py-4 sm:w-1/2"
          onSubmit={handleSubmit}
        >
          <Input label="Email" type="text" value={email} onChange={setEmail} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <button
            className="border w-fit px-4 bg-slate-600 text-text font-medium"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="text-red-500 text-xs mt-2">{error}</div>
      </div>
    </div>
  );
}
