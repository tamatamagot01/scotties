"use client";

import React from "react";
import { useUserManagementStore } from "@/store/zustand";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { userRegister } from "@/apis/user";
import { AxiosError } from "axios";

const userSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  roleId: z.string().min(1, { message: "Role is required" }),
});

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roleId: "",
};

export default function CreateUser() {
  const { setUserManagement } = useUserManagementStore();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const userData = { ...data, roleId: Number(data.roleId) };
      console.log(userData);
      const res = await userRegister(userData);
      alert(res.data.message);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error to create this user", error);
        alert(error.response?.data.error || "Request failed");
      } else {
        console.error("Error to create this user", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleResetField = () => {
    reset(defaultValues);
  };

  return (
    <>
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-full sm:w-3/4 h-5/6 flex flex-col justify-center items-center rounded-xl">
        <button
          className="absolute top-2 right-3"
          onClick={() => setUserManagement("createUser")}
        >
          <Image
            src="/assets/icons/admin/reject.png"
            alt="exit-button"
            width={0}
            height={0}
            className="w-6 h-6"
          />
        </button>
        <div className="text-2xl font-bold pb-7">Create User</div>
        <form
          className="flex flex-col justify-center sm:w-96 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <label>First Name</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="First Name"
              {...register("firstName")}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <label>Last Name</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <label>Email</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="Email"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <label>Password</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <label>Role</label>
            <select className="w-60 border pl-1" {...register("roleId")}>
              <option value={1}>User</option>
              <option value={2}>Admin</option>
            </select>
          </div>

          <div className="text-xs text-red-400">
            {errors.firstName?.message ||
              errors.lastName?.message ||
              errors.email?.message ||
              errors.password?.message ||
              errors.roleId?.message}
          </div>

          <div className="w-full flex justify-center items-center gap-4">
            <button
              className="btn btn-sm"
              type="button"
              onClick={handleResetField}
            >
              Clear data
            </button>
            <button className="btn btn-sm" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
