import React from "react";
import { PropsWithChildren } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export default function InputText({
  children,
  register,
  type,
  error,
}: PropsWithChildren<{
  register: UseFormRegisterReturn;
  type: string;
  error?: string;
}>) {
  return (
    <div className="flex flex-col font-fredoka">
      <label className="text-xs font-semibold pb-1">
        {children} <span className="text-red-500 font-thin">{error}</span>
      </label>
      <input
        {...register}
        className="rounded-md text-primary pl-2 h-7"
        type={type}
      />
    </div>
  );
}
