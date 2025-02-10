/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import InputText from "@/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, profile } from "@/apis/user";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/zustand";

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { setUser } = useUserStore();

  const router = useRouter();

  // ป้องกันการเข้าหน้า login หาก user login อยู่แล้ว

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await profile();
        setUser(response.data);
        router.replace("/profile");
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router, setUser]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = (await login(data)) as any;
      alert(res.data.message);

      const user = await profile();
      setUser(user.data);

      router.replace("/profile");
    } catch (error) {
      console.error("Error: ", error);
      alert((error as any).response.data.error);
    }
  };

  return (
    <div className="relative bg-primary w-full min-h-screen text-text flex flex-col justify-center items-center font-fredoka py-5">
      <div className="w-3/4">
        <Link href={"/"} className="mb-5 flex justify-center">
          <Image
            src={"/assets/decorations/logo-3.png"}
            alt="Logo"
            width={200}
            height={200}
          />
        </Link>

        <div className="text-2xl pb-1">
          Welcome back{" "}
          <span className="text-secondary font-bold">Scotties</span> Member.
        </div>

        <div className="text-xs pb-5">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-secondary underline"
            href={"/register"}
          >
            Register
          </Link>
        </div>

        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputText register={{ ...register("email") }} type="text">
            Email
          </InputText>
          <InputText register={{ ...register("password") }} type="password">
            Password
          </InputText>{" "}
          <button
            className="bg-secondary text-primary w-full h-8 rounded-md mt-5 text-sm"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <div className="pt-7 flex flex-row justify-center items-center gap-5">
          <hr className="w-1/3" />
          <div>OR</div>
          <hr className="w-1/3" />
        </div>

        <div className="flex justify-between items-center pt-7">
          <button className="flex justify-center items-center bg-secondary text-primary text-xs w-[45%] h-8 rounded-md">
            <svg
              className="w-7 pr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Google
          </button>
          <button className="flex justify-center items-center bg-secondary text-primary text-xs w-[45%] h-8 rounded-md">
            <svg
              className="w-7 pr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
