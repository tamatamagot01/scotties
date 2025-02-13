import React from "react";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

type ProductProps = {
  productName: string;
  brand: string;
  price: number;
  imageUrl: string;
  productId: number;
};

export default function ProductItem({
  productName,
  brand,
  price,
  imageUrl,
  productId,
}: ProductProps) {
  const { isOpenSearchBar } = useSearchBar();

  const content = (
    <>
      {/* ใช้แบบ img ไปก่อน ค่อยเปลี่ยนเป็น Image จาก Next  */}
      <div className="flex justify-center items-center">
        <img
          className="w-40 h-40 object-cover rounded-lg"
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div className="text-sm pt-2">{productName}</div>
      <div className="text-xs opacity-70 mt-7">{brand}</div>
      <div className="text-sm font-semibold">{`฿ ${price}`}</div>
    </>
  );

  return isOpenSearchBar ? (
    <div className="w-4/5 px-3 py-5 bg-white rounded-lg">{content}</div>
  ) : (
    <Link
      href={`/store/product/${brand.toLowerCase()}?product-id=${String(
        productId
      )}`}
      className="w-4/5 px-3 py-5 bg-white rounded-lg"
    >
      {content}
    </Link>
  );
}
