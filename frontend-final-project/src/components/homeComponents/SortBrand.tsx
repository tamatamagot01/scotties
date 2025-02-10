import React from "react";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

type PropType = {
  imageUrl: string;
  label: string;
};

export default function SortBrand({ imageUrl, label }: PropType) {
  const { isOpenSearchBar } = useSearchBar();

  const content = (
    <>
      <div className="flex justify-center items-center h-full">
        <img className="h-fit" src={imageUrl} alt={label} />
      </div>
      <label className="pt-2">{label}</label>
    </>
  );

  return isOpenSearchBar ? (
    <div className="flex flex-col justify-end items-center w-28 h-44">
      {content}
    </div>
  ) : (
    <Link
      href={`/store/${label.toLowerCase()}`}
      className="flex flex-col justify-end items-center w-28 h-44"
    >
      {content}
    </Link>
  );
}
