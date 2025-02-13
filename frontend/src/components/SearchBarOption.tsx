import React from "react";
import { OptionProps } from "react-select";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

type ProductOption = {
  id: number;
  label: string;
  imageUrl: string;
  brand: string;
  price: string;
};

export default function SearchBarOption({ data }: OptionProps<ProductOption>) {
  const { setIsOpenSearchBar } = useSearchBar();

  const { label, imageUrl, brand, price, id } = data;

  return (
    <Link
      href={`/store/product/${brand.toLowerCase()}?product-id=${id}`}
      className="flex items-center gap-5 border"
      onClick={() => setIsOpenSearchBar()}
    >
      <div className="w-20 h-20 sm:ml-2">
        <img className="object-contain sm:h-full" src={imageUrl} alt={label} />
      </div>
      <div className="font-medium sm:hidden">
        {label.length > 20 ? label.substring(0, 20) + "..." : label}
      </div>

      <div className="font-medium hidden sm:flex justify-between sm:w-full">
        <div>{label.length > 40 ? label.substring(0, 40) + "..." : label}</div>
        <div className="sm:mr-7">Price: {price}</div>
      </div>
    </Link>
  );
}
