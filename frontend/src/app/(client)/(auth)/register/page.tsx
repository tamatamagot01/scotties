"use client";

import React, { useEffect } from "react";
import InputText from "@/components/InputText";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { userRegister } from "@/apis/user";
import { AxiosError } from "axios";

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password and confirm password should be the same",
    path: ["confirmPassword"],
  });

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { id } = useUserStore();
  const router = useRouter();

  // ป้องกันการเข้าหน้า register หาก user login อยู่แล้ว
  useEffect(() => {
    if (id !== 0) {
      router.replace("/profile");
    }
  }, [id, router]);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const thisUser = { ...data, roleId: 1 };
      const res = await userRegister(thisUser);
      alert(res.data.message);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error to register this user", error);
        alert(error.response?.data.error || "Request failed");
      } else {
        console.error("Error to register this user", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative bg-primary w-full min-h-screen text-text flex flex-col justify-center items-center font-fredoka py-5">
      <div className="w-3/4 max-w-md sm:max-w-lg">
        <Link href={"/"} className="mb-5 flex justify-center">
          <Image
            src={"/assets/decorations/logo-3.png"}
            alt="Logo"
            width={200}
            height={200}
          />
        </Link>

        <div className="text-2xl pb-1">
          Now let&apos;s make you a{" "}
          <span className="text-secondary font-bold">Scotties</span> Member.
        </div>

        <div className="text-xs pb-5">
          Already have an account?{" "}
          <Link
            className="font-semibold text-secondary underline"
            href={"/login"}
          >
            Login
          </Link>
        </div>

        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputText
            register={{ ...register("firstName") }}
            type="text"
            error={errors.firstName?.message as string}
          >
            First Name
          </InputText>
          <InputText
            register={{ ...register("lastName") }}
            type="text"
            error={errors.lastName?.message as string}
          >
            Last Name
          </InputText>
          <InputText
            register={{ ...register("email") }}
            type="text"
            error={errors.email?.message as string}
          >
            Email
          </InputText>
          <InputText
            register={{ ...register("password") }}
            type="password"
            error={errors.password?.message as string}
          >
            Password
          </InputText>
          <InputText
            register={{ ...register("confirmPassword") }}
            type="password"
            error={errors.confirmPassword?.message as string}
          >
            Confirm Password
          </InputText>

          <button
            className="bg-secondary text-primary w-full h-8 rounded-md mt-5 text-sm"
            type="submit"
          >
            Create Account
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
