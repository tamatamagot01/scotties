/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePassword } from "@/apis/user";

type ChangePasswordDataType = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

const passwordSchema = z
  .object({
    password: z.string().min(1, "Password is required"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: "Password and confirm password should be the same",
      path: ["confirmNewPassword"],
    }
  );

const defaultValues = {
  password: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ChangePassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ChangePasswordDataType) => {
    try {
      const res = await changePassword(data);
      console.log(res.data);
      setErrorMessage("");
      alert(res.data.message);

      router.push("/profile");
    } catch (error: any) {
      console.log("Error to change password", error);
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <div className="font-fredoka">
      <Navbar />

      <div className="ml-2 mt-2">
        <button className="btn btn-xs" onClick={() => router.push("/profile")}>
          Back to Profile
        </button>
      </div>

      <div className="flex flex-col mt-44 justify-center items-center">
        <div className="text-lg font-medium mb-4">Change Password</div>

        <form
          className="flex flex-col gap-2 justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="sm:flex">
            <div className="w-48">
              <label>Old Password</label>
            </div>
            <input
              className="border rounded-lg px-2"
              type="password"
              {...register("password")}
            />
          </div>
          <div className="sm:flex">
            <div className="w-48">
              <label className="w-40">New Password</label>
            </div>
            <input
              className="border rounded-lg px-2"
              type="password"
              {...register("newPassword")}
            />
          </div>
          <div className="sm:flex">
            <div className="w-48">
              <label className="w-40">Confirm New Password</label>
            </div>
            <input
              className="border rounded-lg px-2"
              type="password"
              {...register("confirmNewPassword")}
            />
          </div>

          <div className="text-xs text-red-400">
            {errors.password?.message ||
              errors.newPassword?.message ||
              errors.confirmNewPassword?.message ||
              errorMessage}
          </div>

          <button
            className="btn btn-sm bg-secondary hover:bg-darkSecondary w-1/2 mt-4"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
