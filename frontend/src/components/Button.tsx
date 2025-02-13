import React from "react";
import { PropsWithChildren } from "react";

export default function Button({
  children,
  custom,
}: PropsWithChildren<{ custom: string }>) {
  return (
    <div
      className={`w-[4.5rem] h-7 ${custom} font-medium rounded-md font-fredoka flex justify-center items-center`}
    >
      <button>{children}</button>
    </div>
  );
}
