import React from "react";
import rightArrow from "../../../public/assets/icons/arrow-small-right.svg";
import Image from "next/image";
import Link from "next/link";
import { useSearchBar } from "@/store/zustand";

type PropType = {
  label: string;
  content: string;
};

export default function HeaderText({ label, content }: PropType) {
  const { isOpenSearchBar } = useSearchBar();
  return (
    <div className="flex flex-col justify-center items-center font-fredoka">
      <label className="text-2xl font-semibold">{label}</label>
      {isOpenSearchBar ? (
        <div className="flex">
          <Image src={rightArrow} alt="right-icon" width={18} height={18} />
          <div className="text-xs font-medium">{content}</div>
        </div>
      ) : (
        <Link href={"/"} className="flex">
          <Image src={rightArrow} alt="right-icon" width={18} height={18} />
          <div className="text-xs font-medium">{content}</div>
        </Link>
      )}
    </div>
  );
}
