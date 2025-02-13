import React from "react";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

export default function ImageHome({
  imageUrl,
  imageName,
  linkUrl,
}: Record<string, string>) {
  const { isOpenSearchBar } = useSearchBar();

  return (
    <div className="flex flex-col justify-center items-center font-fredoka font-medium sm:relative">
      <img
        className="w-full h-52 sm:h-[400px] sm:w-[500px] rounded-xl"
        src={imageUrl}
        alt={imageName}
      />
      {isOpenSearchBar ? (
        <div className="bg-secondary rounded-md w-1/2 h-8 mt-3 flex justify-center items-center sm:absolute sm:bottom-3 sm:w-[250px]">
          Shop Now
        </div>
      ) : (
        <Link
          href={linkUrl}
          className="bg-secondary rounded-md w-1/2 h-8 mt-3 flex justify-center items-center sm:absolute sm:bottom-3 sm:w-[250px]"
        >
          Shop Now
        </Link>
      )}
    </div>
  );
}
