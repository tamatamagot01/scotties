/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Image from "next/image";
import logo from "@public/assets/decorations/logo-beautiful.png";
import { logout } from "@/apis/user";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/zustand";

type PropTypes = {
  selected: {
    home: boolean;
    product: boolean;
    user: boolean;
    order: boolean;
  };
  onSelect: (select: string) => void;
  isOpenMenu: boolean;
  setIsOpenMenu: (isOpen: boolean) => void;
};

export default function Sidebar({
  onSelect,
  selected,
  isOpenMenu,
  setIsOpenMenu,
}: PropTypes) {
  const router = useRouter();

  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    await logout();
    clearUser();
    router.replace("/admin/login");
  };

  return (
    <div className="flex flex-row md:flex-col justify-between md:justify-start items-center px-5 py-4 bg-indigo-400">
      <div className="md:py-10 w-14">
        <Image
          className="w-14 rounded-full"
          sizes="100vw"
          src={logo}
          alt="logo"
          width={0}
          height={0}
        />
      </div>

      <button className="md:hidden" onClick={() => setIsOpenMenu(!isOpenMenu)}>
        <Image
          src="/assets/icons/admin/hamburger.png"
          alt="hamburger-icon"
          width={0}
          height={0}
          className="w-8"
          sizes="100vw"
        />
      </button>

      {/* for mobile-size */}
      {isOpenMenu && (
        <div className="absolute right-0 top-0 translate-y-[3.40rem] px-5 py-10 z-10 rounded-b-xl flex flex-col gap-10 md:hidden bg-indigo-400">
          <button
            className={`p-1 rounded-lg ${selected.home && "bg-fuchsia-400"}`}
            onClick={() => onSelect("home")}
          >
            <Image
              src="/assets/icons/admin/home.png"
              alt="home-icon"
              width={0}
              height={0}
              className="w-8"
              sizes="100vw"
            />
          </button>

          <button
            className={`p-1 rounded-lg ${selected.product && "bg-fuchsia-400"}`}
            onClick={() => onSelect("product")}
          >
            <Image
              src="/assets/icons/admin/shoes.png"
              alt="product-icon"
              width={0}
              height={0}
              className="w-8"
              sizes="100vw"
            />
          </button>

          <button
            className={`p-1 rounded-lg ${selected.user && "bg-fuchsia-400"}`}
            onClick={() => onSelect("user")}
          >
            <Image
              src="/assets/icons/admin/user.png"
              alt="user-icon"
              width={0}
              height={0}
              className="w-8"
              sizes="100vw"
            />
          </button>

          <button
            className={`p-1 rounded-lg ${selected.order && "bg-fuchsia-400"}`}
            onClick={() => onSelect("order")}
          >
            <Image
              src="/assets/icons/admin/product.png"
              alt="order-icon"
              width={0}
              height={0}
              className="w-8"
              sizes="100vw"
            />
          </button>

          <button onClick={handleLogout}>
            <Image
              src="/assets/icons/exit.png"
              alt="logout-icon"
              width={0}
              height={0}
              className="ml-1 w-7"
              sizes="100vw"
            />
          </button>
        </div>
      )}

      {/* for desktop-size */}
      <div className="hidden md:flex flex-col gap-20 bg-indigo-400 w-full">
        <button
          className={`w-full py-1 rounded-md flex justify-center ${
            selected.home && "bg-fuchsia-400"
          }`}
          onClick={() => onSelect("home")}
        >
          <Image
            src="/assets/icons/admin/home.png"
            alt="home-icon"
            width={0}
            height={0}
            className="w-8"
            sizes="100vw"
          />
        </button>

        <button
          className={`w-full py-1 rounded-md flex justify-center ${
            selected.product && "bg-fuchsia-400"
          }`}
          onClick={() => onSelect("product")}
        >
          <Image
            src="/assets/icons/admin/shoes.png"
            alt="home-icon"
            width={0}
            height={0}
            className="w-9"
            sizes="100vw"
          />
        </button>

        <button
          className={`w-full py-1 rounded-md flex justify-center ${
            selected.user && "bg-fuchsia-400"
          }`}
          onClick={() => onSelect("user")}
        >
          <Image
            src="/assets/icons/admin/user.png"
            alt="home-icon"
            width={0}
            height={0}
            className="w-8"
            sizes="100vw"
          />
        </button>

        <button
          className={`w-full py-1 rounded-md flex justify-center ${
            selected.order && "bg-fuchsia-400"
          }`}
          onClick={() => onSelect("order")}
        >
          <Image
            src="/assets/icons/admin/product.png"
            alt="order-icon"
            width={0}
            height={0}
            className="w-8"
            sizes="100vw"
          />
        </button>

        <button className="w-full flex justify-center" onClick={handleLogout}>
          <Image
            src="/assets/icons/exit.png"
            alt="logout-icon"
            width={0}
            height={0}
            className="ml-1 w-7"
            sizes="100vw"
          />
        </button>
      </div>
    </div>
  );
}
