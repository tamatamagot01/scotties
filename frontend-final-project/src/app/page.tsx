"use client";

import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import HeaderText from "@/components/homeComponents/HeaderText";
import ImageHome from "@/components/homeComponents/ImageHome";
import SortBrand from "@/components/homeComponents/SortBrand";
import leftIcon from "@public/assets/icons/arrow-small-left.svg";
import rightIcon from "@public/assets/icons/arrow-small-right.svg";
import { useEffect, useState } from "react";
import { getAsset } from "@/apis/asset";
import { getAllBrand } from "@/apis/productManagement";
import Image from "next/image";
import Link from "next/link";
import Categories from "@/components/homeComponents/Categories";
import { useSearchBar } from "@/store/zustand";

type Asset = {
  id: number;
  name: string;
  imageUrl: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [newArivalImage, setNewArivalImage] = useState<Asset[]>([]);
  const [brandNames, setBrandNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brandPosition, setBranPosition] = useState(0);

  const { isOpenSearchBar } = useSearchBar();

  const [selectedCatagory, setSelectedCatagory] = useState("Shoes");

  const [isOpenMenu, setIsOpenMenu] = useState({
    getHelp: false,
    aboutUs: false,
  });

  function onOpenMenu(menu: "getHelp" | "aboutUs") {
    setIsOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  }

  // ดึง asset ที่ New Arrival Carousel กับ ชื่อ brand ทั้งหมด
  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetResponse = await getAsset();
        const assets = assetResponse.data;
        setNewArivalImage([assets[3], assets[4], assets[5]]);

        const brandResponse = await getAllBrand();
        const brands = brandResponse.data.map(
          (brand: Record<string, string>) => brand.name
        );
        setBrandNames(brands);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ตั้งเวลาสำหรับ New Arrival Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newArivalImage.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [newArivalImage.length]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  return (
    <div className="font-fredoka">
      <Navbar />
      <Carousel />
      <div
        className={`px-5 flex flex-col gap-7 sm:px-10 ${
          isOpenSearchBar && "opacity-30"
        }`}
      >
        {/* New Arrival */}
        <div className="new-arrival pt-3 md:mt-10">
          <HeaderText label="New Arrival" content="Shop All for New Arrival" />
          <div className="relative overflow-hidden h-64 sm:h-[400px] sm:mt-5">
            {newArivalImage.map((image, index) => (
              <div
                key={image.id}
                className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${100 * (index - currentIndex)}%)`,
                }}
              >
                <ImageHome
                  imageUrl={image.imageUrl}
                  imageName={image.name}
                  linkUrl="/"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sort by Brand */}
        <div className="sort-brand overflow-hidden md:mt-10">
          <HeaderText label="Brand" content="Sort By Brand" />
          <div
            className="flex flex-row gap-5 overflow-hidden min-w-max transition-transform duration-500"
            style={{
              transform: `translateX(${0 - brandPosition}%)`,
            }}
          >
            {brandNames.map((brand: string) => (
              <SortBrand
                key={brand}
                imageUrl={`/assets/brands/${
                  brand.substring(0, 1).toLowerCase() + brand.substring(1)
                }.png`}
                label={brand}
              />
            ))}
          </div>
          <div className="w-full flex flex-row justify-center items-center gap-8 mt-2 md:mt-6">
            <button
              className={`${
                brandPosition === 0 ? "bg-gray-200" : "bg-secondary"
              } rounded-full flex justify-center items-center`}
              onClick={() =>
                brandPosition > 0
                  ? setBranPosition((prevPosition) => prevPosition - 12)
                  : null
              }
              disabled={isOpenSearchBar}
            >
              <Image src={leftIcon} alt="left-icon" width={20} height={20} />
            </button>
            <button
              className={`${
                brandPosition === 84 ? "bg-gray-200" : "bg-secondary"
              } rounded-full flex justify-center items-center`}
              onClick={() =>
                brandPosition < 84
                  ? setBranPosition((prevPosition) => prevPosition + 12)
                  : null
              }
              disabled={isOpenSearchBar}
            >
              <Image src={rightIcon} alt="right-icon" width={20} height={20} />
            </button>
          </div>
        </div>

        {/* Shop by Gender */}
        <div className="md:flex md:gap-5 md:mt-10">
          {["men", "women", "kid"].map((gender, index) => (
            <div
              className="shop-men flex flex-col justify-center items-center"
              key={index}
            >
              <Image
                src={`/assets/decorations/${gender}.png`}
                alt={`${gender}-categories`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
              {isOpenSearchBar ? (
                <div className="bg-secondary w-1/2 md:w-36 h-8 mt-3 flex justify-center items-center rounded-md">
                  Shop for {gender}
                </div>
              ) : (
                <Link
                  href={"/"}
                  className="bg-secondary w-1/2 md:w-36 h-8 mt-3 flex justify-center items-center rounded-md"
                >
                  Shop for {gender}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center md:mt-10">
          <div className="text-2xl font-semibold">Categories</div>
          <div className="grid grid-cols-3 gap-1 mt-2 md:flex md:gap-6 md:mt-5">
            {["Shoes", "T-Shirt", "Pants", "Hoodies", "Jacket", "Acc"].map(
              (category, index) => (
                <button
                  onClick={() => setSelectedCatagory(category)}
                  className={`${
                    selectedCatagory === category ? "bg-secondary" : null
                  } border border-secondary text-center rounded-lg md:px-3`}
                  disabled={isOpenSearchBar}
                  key={index}
                >
                  {category}
                </button>
              )
            )}
          </div>
          {/* ส่วนแสดง categories ที่สุ่มมา 5 อย่าง */}
          <Categories category={selectedCatagory} />

          {isOpenSearchBar ? (
            <div className="flex justify-center items-center bg-secondary w-3/4 md:w-36 md:h-8 mt-3 md:mt-6 text-center rounded-md text-sm font-medium">
              Find more...
            </div>
          ) : (
            <Link
              href={`/store/${selectedCatagory}`}
              className="flex justify-center items-center bg-secondary w-3/4 md:w-36 md:h-8 mt-3 md:mt-6 text-center rounded-md text-sm font-medium"
            >
              Find more...
            </Link>
          )}
        </div>
      </div>

      {/* FollowUs */}
      <hr className="mt-7 px-5" />
      <div className="flex flex-col justify-center items-center my-12">
        <div className="flex gap-3">
          <Image
            src="/assets/3rd-parties/facebook-app-symbol.png"
            alt="facebook-icon"
            width={0}
            height={0}
            sizes="100vw"
            className="w-6"
          />
          <Image
            src="/assets/3rd-parties/instagram.png"
            alt="instagram-icon"
            width={0}
            height={0}
            sizes="100vw"
            className="w-6"
          />
        </div>
        <div className="text-sm font-semibold translate-x-1">Follow Us</div>
        <div className="text-xs font-thin flex flex-col justify-center items-center mt-5">
          <div>Stay updated with the latest news</div>
          <div>from Scotties</div>
          <div>on our social media</div>
        </div>
      </div>
      <hr className="mb-7" />

      {/* Get Help & About Us */}
      <div className="px-5">
        <div className="border border-t-0 border-l-0 border-r-0 py-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Get Help</div>
            <button onClick={() => onOpenMenu("getHelp")}>
              <Image
                src={`${
                  isOpenMenu.getHelp
                    ? "/assets/icons/minus.png"
                    : "/assets/icons/plus.png"
                }`}
                alt="icon"
                width={0}
                height={0}
                sizes="100vw"
                className="w-3 h-3"
              />
            </button>
          </div>
          {isOpenMenu.getHelp ? (
            <div className="text-xs font-light flex flex-col gap-1 pt-2">
              <div>Find a Store</div>
              <div>Contact Us</div>
              <div>FAQs</div>
              <div>Return Policy</div>
            </div>
          ) : null}
        </div>
        <div className="border border-t-0 border-l-0 border-r-0 py-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">About Us</div>
            <button onClick={() => onOpenMenu("aboutUs")}>
              <Image
                src={`${
                  isOpenMenu.aboutUs
                    ? "/assets/icons/minus.png"
                    : "/assets/icons/plus.png"
                }`}
                alt="icon"
                width={0}
                height={0}
                sizes="100vw"
                className="w-3 h-3"
              />
            </button>
          </div>
          {isOpenMenu.aboutUs ? (
            <div className="text-xs font-light flex flex-col gap-1 pt-2">
              <div>About Scotties</div>
              <div>Terms & Condition</div>
              <div>Privacy Policy</div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Never Miss */}
      <div className="my-7 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="text-lg font-semibold">Never Miss a Beat</div>
          <div className="flex flex-col justify-center items-center text-xs pt-2">
            <div>Be the first to hear about product launches,</div>
            <div>collaborations, and more when you sign up</div>
            <div>for our emails.</div>
          </div>
        </div>
        <div className="flex h-8 mt-3">
          <input
            className="border text-xs pl-3 w-40"
            type="text"
            placeholder="Enter your email address"
          />
          <button className="bg-secondary w-7 flex items-center justify-center">
            <Image
              src="/assets/icons/arrow-small-right.svg"
              alt="right-arrow-button"
              width={0}
              height={0}
              sizes="100vw"
              className="w-5"
            />
          </button>
        </div>
        <div className="text-xs flex flex-col justify-center items-center mt-3 opacity-75">
          <div>
            <span className="pr-2">
              <input type="checkbox" />
            </span>
            Yes, i want to subscribe to get more
          </div>
          <div>information on large selection of new</div>
          <div>products, promotions, special prices, events</div>
          <div>and other interesting offers</div>
        </div>
        <div className="text-xs flex flex-col justify-center items-center mt-5 opacity-75">
          <div>By subscribing, you agree to receive any</div>
          <div>communications from us and you have read</div>
          <div>
            our <span className="underline">Privacy Policy</span> and{" "}
            <span className="underline">Terms & Conditions.</span>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-end items-center bg-primary py-5 mt-10">
        <div className="text-[10px] font-medium text-text pr-3">
          © 2024 Scotties
        </div>
      </div>
    </div>
  );
}
