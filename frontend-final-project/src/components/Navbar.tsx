"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { useUserStore } from "@/store/zustand";
import profileImage from "../../public/assets/decorations/profile-image.jpg";
import { logout } from "@/apis/user";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import SearchBarOption from "./SearchBarOption";
import { useSearchBar } from "@/store/zustand";
import { getProductByName } from "@/apis/products";

export type ProductType = {
  id: number;
  productName: string;
  imageUrl: string;
  brand: {
    name: string;
  };
  price: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { id, firstName, clearUser } = useUserStore();

  const { isOpenSearchBar, setIsOpenSearchBar } = useSearchBar();

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    clearUser();
    router.replace("/login");
  };

  const loadOptions = async (inputFilter: string) => {
    const products = await getProductByName({ nameFilter: inputFilter });

    const filteredProducts = products.data;
    return filteredProducts.map((product: ProductType) => ({
      id: product.id,
      label: product.productName,
      imageUrl: product.imageUrl,
      brand: product.brand.name,
      price: product.price,
    }));
  };

  return (
    <div className="relative flex justify-between items-center px-5 py-5 bg-primary z-30">
      {/* logo */}
      <Link href={"/"}>
        <Image
          className="w-32 md:w-60 lg:w-72"
          src={"/assets/decorations/logo-3.png"}
          alt="Logo"
          width={180}
          height={180}
        />
      </Link>

      <div className="flex gap-5">
        {/* search-bar */}
        {isOpenSearchBar && (
          <div className="absolute left-0 top-[72px] w-full flex justify-center">
            <AsyncSelect
              className="w-[90%] sm:w-[60%]"
              loadOptions={loadOptions}
              components={{ Option: SearchBarOption }}
              getOptionValue={(option) => option.id?.toString() ?? ""}
              getOptionLabel={(option) => option.label ?? ""}
              placeholder="Search product"
            />
          </div>
        )}

        {/* search-icon */}
        <button
          onClick={() => {
            setIsOpenSearchBar();
          }}
        >
          <svg
            className="w-4 md:w-[18px] fill-secondary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </button>

        {/* profile-icon */}
        <Link href={"/profile"}>
          <svg
            className="w-4 md:w-[18px] fill-secondary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
          </svg>
        </Link>

        {/* cart-icon */}
        <Link href={"/cart"}>
          <svg
            className="w-4 md:w-[18px] fill-secondary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
          </svg>
        </Link>

        {/* hamburger-menu-icon */}
        <button
          className={`fill-secondary w-4 md:w-[18px] ${
            isOpen ? "opacity-50" : null
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>
      </div>

      {/* menu */}
      {!isOpen ? null : (
        <div className="px-10 py-7 min-h-screen w-4/5 md:w-2/5 absolute right-0 bottom-0 translate-y-full bg-primary font-fredoka">
          <div className="text-text font-medium">
            <ul className="flex flex-col items-start text-2xl list-none">
              <li className="flex justify-center items-center h-10">
                New Arrival
              </li>
              <li className="flex justify-center items-center h-10">Men</li>
              <li className="flex justify-center items-center h-10">Women</li>
              <li className="flex justify-center items-center h-10">Kids</li>
              <li className="flex justify-center items-center h-10">Sale</li>
            </ul>
          </div>

          {id === 0 ? (
            <div className="flex flex-col">
              <p className="text-lg opacity-80 pt-14 text-text">
                Become a Scotties Member for the best products, inspiration and
                stories in streetwear.
              </p>

              <div className="flex gap-3 pt-3">
                <Link href={"/register"}>
                  <Button custom="bg-primary text-text border">Join us</Button>
                </Link>
                <Link href={"/login"}>
                  <Button custom="bg-secondary">Sign in</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-text pt-14">
              <div className="font-medium text-secondary">{`Welcome back! ${firstName}`}</div>
              <Link href={"/profile"} className="flex items-center gap-5 pt-5">
                <Image
                  className="w-10 h-10 rounded-full"
                  src={profileImage}
                  alt="profile-image"
                  width={profileImage.width}
                  height={profileImage.height}
                />
                <div className="text-sm font-medium underline">See Profile</div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 w-fit text-xs font-medium border border-[#FA0202] px-1 rounded-xl text-[#FA0202] -translate-x-[0.30rem]"
              >
                Sign out
              </button>
            </div>
          )}

          <div className="list-none text-text pt-14">
            <li className="flex flex-col gap-2">
              <ul className="flex gap-2">
                <svg
                  className="w-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                </svg>
                Cart
              </ul>
              <ul className="flex gap-2">
                <svg
                  className="w-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z" />
                </svg>
                Find a Store
              </ul>
              <ul className="flex gap-2">
                <svg
                  className="w-4 fill-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
                Contact us
              </ul>
            </li>
          </div>
        </div>
      )}
    </div>
  );
}
