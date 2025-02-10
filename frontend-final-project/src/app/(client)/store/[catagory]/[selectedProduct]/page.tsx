/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  canReviewThisProduct,
  getAllReviewByProductId,
  getProductById,
  incrementViewCount,
  sendReview,
} from "@/apis/products";
import { useSearchBar } from "@/store/zustand";
import { userCreateOrder } from "@/apis/order";
import { useUserStore, useOrderStore } from "@/store/zustand";
import adidasLogo from "@public/assets/brands/adidas.png";
import asicsLogo from "@public/assets/brands/asics.png";
import converseLogo from "@public/assets/brands/converse.png";
import filaLogo from "@public/assets/brands/fila.png";
import jordanLogo from "@public/assets/brands/jordan.png";
import newBalanceLogo from "@public/assets/brands/new-balance.png";
import nikeLogo from "@public/assets/brands/nike.png";
import pumaLogo from "@public/assets/brands/puma.png";
import reebokLogo from "@public/assets/brands/reebok.png";
import timberlandLogo from "@public/assets/brands/timberland.png";
import vansLogo from "@public/assets/brands/vans.png";
import imageUploadIcon from "@public/assets/icons/image-gallery.png";
import uplodeFromDeviceIcon from "@public/assets/icons/upload.png";
import uplodeFromLinkIcon from "@public/assets/icons/link.png";
import closeIcon from "@public/assets/icons/admin/reject.png";
import leftArrowIcon from "@public/assets/icons/arrow-small-left.svg";
import Image from "next/image";
import { addFavoriteItem } from "@/apis/user";

type SearchParams = { [key: string]: string | string[] | undefined };

type ThisProduct = {
  id: number;
  description: string;
  imageUrl: string;
  price: number;
  productName: string;
  productOptions: {
    id: number;
    optionName: string;
    quantity: number;
  }[];
  brand: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    typeName: string;
  };
  isActive: boolean;
};

type OptionsType =
  | {
      US7: boolean;
      "US7.5": boolean;
      US8: boolean;
      "US8.5": boolean;
      US9: boolean;
      "US9.5": boolean;
      US10: boolean;
      "US10.5": boolean;
      US11: boolean;
      "US11.5": boolean;
      US12: boolean;
      "US12.5": boolean;
    }
  | {
      XS: boolean;
      S: boolean;
      M: boolean;
      L: boolean;
      XL: boolean;
      "2XL": boolean;
    }
  | {
      Red: boolean;
      Blue: boolean;
      Green: boolean;
      White: boolean;
      Black: boolean;
      Yellow: boolean;
    };

const shoesOptionsDefaultClick = {
  US7: false,
  "US7.5": false,
  US8: false,
  "US8.5": false,
  US9: false,
  "US9.5": false,
  US10: false,
  "US10.5": false,
  US11: false,
  "US11.5": false,
  US12: false,
  "US12.5": false,
};

const shirtOptionsDefaultClick = {
  XS: false,
  S: false,
  M: false,
  L: false,
  XL: false,
  "2XL": false,
};

const accOptionsDefaultClick = {
  Red: false,
  Blue: false,
  Green: false,
  White: false,
  Black: false,
  Yellow: false,
};

type ReviewType = {
  id: number;
  productId: number;
  ratingScore: number;
  reviewContent: string;
  userId: number;
  User: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  productOption: {
    ProductOption: { optionName: string };
  }[];
  reviewImages: {
    imageUrl: string;
  }[];
  createdAt: string;
};

export default function SelectedProduct({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { "product-id": productId } = searchParams;

  const [isLoading, setIsLoading] = useState(true);

  const { id } = useUserStore();

  const { isOpenSearchBar } = useSearchBar();

  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);
  const [isOpenProductReviews, setIsOpenProductReviews] = useState(false);

  const [thisProduct, setThisProduct] = useState<ThisProduct>();

  const {
    description,
    imageUrl,
    price,
    productName,
    productOptions,
    brand,
    type,
    isActive,
  } = thisProduct || {};
  const brandName = brand?.name;
  const typeName = type?.typeName;

  // ใช้หาผลรวมทั้งหมดของ Product ทุก Option
  const totalQuantity = thisProduct?.productOptions.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );

  // ใช้เก็บ option ของสินค้าที่ client เลือก
  const [selectedOption, setSelectedOption] = useState<{
    id: number;
    optionName: string;
    quantity: number;
  }>();

  // ใช้ควบคุม true/false ของการ Click Option
  const [isSelectShoesOption, setIsSelectShoesOption] = useState(
    shoesOptionsDefaultClick
  );
  const [isSelectShirtOption, setIsSelectShirtOption] = useState(
    shirtOptionsDefaultClick
  );
  const [isSelectAccOption, setIsSelectAccOption] = useState(
    accOptionsDefaultClick
  );

  const [errorMessage, setErrorMessage] = useState("");

  // สำหรับ fetch product ตาม productId ที่ส่งม
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const selectedProduct = await getProductById({ productId });

        const product = selectedProduct.data;

        setThisProduct(product);
      } catch (error) {
        console.error("Error to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // สำหรับเพิ่ม viewCount +1 เมื่อ user เข้าหน้านี้ 1 ครั้ง
  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementViewCount({ productId });
      } catch (error) {
        console.error("Error incrementing the view count", error);
      }
    };

    incrementView();
  }, [productId]);

  const [selectQuantity, setSelectQuantity] = useState(0);

  const { addOrderItem } = useOrderStore();

  const handleCreateOrder = async () => {
    try {
      if (selectQuantity <= 0) {
        setErrorMessage("Incorrect Quantity");
        return;
      }

      if (thisProduct && selectQuantity > selectedOption!.quantity) {
        setErrorMessage("More than maximum quantity");
        return;
      }

      // หากมีการ login จะส่ง product ที่จะเพิ่มในตระกร้าไปเก็บใน Database
      if (id !== 0 && selectedOption && selectQuantity) {
        setErrorMessage("");

        await userCreateOrder({
          userId: id,
          productId: thisProduct?.id,
          optionId: selectedOption.id,
          quantity: selectQuantity,
        });
        alert("Added product into the cart");
      }

      // หากไม่มีการ login จะส่ง product ที่จะเพิ่มในตระกร้าไปเก็บใน localStorage แทน
      if (id === 0 && selectedOption && selectQuantity && thisProduct) {
        setErrorMessage("");

        addOrderItem({
          productId: thisProduct?.id,
          optionId: selectedOption.id,
          quantity: selectQuantity,
        });
        alert("Added product into the cart");
      }
    } catch (error) {
      console.error("Error to create order", error);
    }
  };

  const handleAddFavoriteItem = async () => {
    try {
      const res = await addFavoriteItem({ productId });
      alert(res.data.message);
    } catch (error: any) {
      console.error("Error to add favorite item", error);
      alert(error.response.data.error);
    }
  };

  // Review Zone

  const [isOpenUploadImage, setIsOpenUploadImage] = useState(false);
  const [isOpenUplodeFromLink, setIsOpenUplodeFromLink] = useState(false);

  const [reviewText, setReviewText] = useState("");

  const [ratingScore, setRatingScore] = useState(5);

  const [imageLink, setImageLink] = useState("");
  const [uploadedImageLinks, setUploadedImageLinks] = useState<
    { imageUrl: string }[]
  >([]);

  const [userBoughtThisProduct, setUserBoughtThisProduct] = useState([]);

  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const [countScore, setCountScore] = useState<number[]>([]);
  const [averageScore, setAverageScore] = useState(0);

  const handleUploadImageLink = () => {
    setUploadedImageLinks((prev) => [...prev, { imageUrl: imageLink }]);

    setImageLink("");
  };

  const handleDeleteImageLink = (imageUrl: string) => {
    setUploadedImageLinks((prev) =>
      prev.filter((image) => image.imageUrl !== imageUrl)
    );
  };

  // สำหรับการ fetch review ที่มีทั้งหมดของ product นี้
  useEffect(() => {
    const handleFetchReview = async () => {
      try {
        const res = await getAllReviewByProductId(String(productId));

        setReviews(res.data);
      } catch (error: any) {
        console.error("Error:", error.response.data.error);
      }
    };

    handleFetchReview();
  }, [productId]);

  // เอา ratingScore ของทุก review มาคำนวน average และนับว่าแต่ละ review ให้กี่ดาว
  useEffect(() => {
    const count = reviews.map((review) => review.ratingScore);

    const averageScore = (
      count.reduce((acc, cur) => acc + cur, 0) /
      (count.length === 0 ? 1 : count.length)
    ).toFixed(1);

    setCountScore(count);
    setAverageScore(Number(averageScore));
  }, [reviews]);

  // ส่ง productId ไป และส่ง token ตรงฝั่ง Server ไปเพื่อดูว่า user คนนี้เคยซื้อสินค้าไหม เคยรีวิวมาก่อนไหม (หากเคยซื้อ และไม่เคยรีวิวสินค้านี้มาก่อน ก็สามารถเขียนรีวิวได้)
  useEffect(() => {
    const handleCanReview = async () => {
      try {
        const res = await canReviewThisProduct(String(productId));

        setUserBoughtThisProduct(res.data);
      } catch (error: any) {
        console.error("Error:", error.response.data.error);
      }
    };

    handleCanReview();
  }, [productId]);

  const handleSubmitReview = () => {
    const postReview = async () => {
      const reviewData = {
        userId: id,
        reviewContent: reviewText,
        ratingScore: ratingScore,
        reviewImages: uploadedImageLinks,
        productOptions: userBoughtThisProduct,
        productId: productId,
      };

      try {
        await sendReview(reviewData);
      } catch (error) {
        console.error("Error to review this product", error);
      } finally {
        window.location.reload();
      }
    };

    postReview();
  };

  // Loading component Zone : ใช้ตอน fetch data
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  return (
    <div className="px-3 pb-5 min-h-[90vh]">
      <div className={`${isOpenSearchBar && "opacity-30"}`}>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href={`/store/${brandName?.toLowerCase()}`}>{brandName}</a>
            </li>
            <li className="underline">
              {productName &&
                productName?.substring(0, 1).toUpperCase() +
                  productName?.substring(1, productName.length)}
            </li>
          </ul>
        </div>

        {/* product section */}
        <div className="pt-5">
          <div
            className={`text-2xl sm:text-3xl font-semibold ${
              !totalQuantity && "text-red-400"
            }`}
          >
            {productName &&
              productName?.substring(0, 1).toUpperCase() +
                productName?.substring(1, productName.length)}
          </div>
          {!totalQuantity && (
            <div className="text-2xl sm:text-3xl font-semibold text-red-400">{`(Out of stock)`}</div>
          )}

          <div className="sm:flex sm:mt-4">
            <div className={`sm:w-1/2 ${!isActive && "relative"}`}>
              <img
                className={`rounded-xl pb-3 overflow-hidden sm:w-full ${
                  !isActive && "opacity-20"
                }`}
                src={imageUrl}
                alt="product-image"
              />

              {!isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-xl sm:text-3xl font-semibold text-center">
                  This product is not available
                </div>
              )}
            </div>

            <hr className="sm:hidden border-black" />
            <div className="hidden sm:block min-h-fit rounded-lg border"></div>

            <div className="sm:w-1/2 sm:px-4 mt-2 sm:mt-0">
              <div className="text-md sm:text-xl font-medium mt-1">
                ฿{price}
              </div>

              <div className="mt-2 sm:mt-5">
                <div className="text-xs sm:text-sm">Select Size</div>
                {productOptions && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                    {productOptions.map(
                      (
                        option: {
                          id: number;
                          optionName: string;
                          quantity: number;
                        },
                        index
                      ) => (
                        <button
                          className={`border rounded-md ${
                            !option.quantity && "bg-slate-300 opacity-40"
                          } ${
                            isSelectShoesOption[
                              option.optionName as keyof OptionsType
                            ] && "bg-secondary"
                          } ${
                            isSelectShirtOption[
                              option.optionName as keyof OptionsType
                            ] && "bg-secondary"
                          } ${
                            isSelectAccOption[
                              option.optionName as keyof OptionsType
                            ] && "bg-secondary"
                          }`}
                          key={index}
                          disabled={!option.quantity}
                          onClick={() => {
                            setSelectedOption({
                              id: option.id,
                              optionName: option.optionName,
                              quantity: option.quantity,
                            });

                            if (thisProduct?.type.typeName === "Shoes") {
                              setIsSelectShoesOption({
                                US7: false,
                                "US7.5": false,
                                US8: false,
                                "US8.5": false,
                                US9: false,
                                "US9.5": false,
                                US10: false,
                                "US10.5": false,
                                US11: false,
                                "US11.5": false,
                                US12: false,
                                "US12.5": false,
                                [option.optionName]: true,
                              });
                            } else if (thisProduct?.type.typeName === "Acc") {
                              setIsSelectAccOption({
                                Red: false,
                                Blue: false,
                                Green: false,
                                White: false,
                                Black: false,
                                Yellow: false,
                                [option.optionName]: true,
                              });
                            } else {
                              setIsSelectShirtOption({
                                XS: false,
                                S: false,
                                M: false,
                                L: false,
                                XL: false,
                                "2XL": false,
                                [option.optionName]: true,
                              });
                            }
                          }}
                        >
                          {thisProduct?.type.typeName === "Shoes"
                            ? `US ` + option.optionName.substring(2)
                            : option.optionName}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedOption && (
                <div className="my-3 sm:my-5">
                  <div className="text-xs sm:text-sm opacity-50">Quantity</div>
                  <input
                    className="w-20 border px-1 rounded-md"
                    type="number"
                    onChange={(e) => setSelectQuantity(Number(e.target.value))}
                    disabled={!isActive || !selectedOption?.quantity}
                  />
                  <div className="text-xs sm:text-sm opacity-50">
                    In Stock:{" "}
                    {selectedOption?.quantity
                      ? selectedOption.quantity
                      : "Out of stock"}
                    {selectedOption?.quantity
                      ? selectedOption?.quantity > 1
                        ? " items"
                        : " item"
                      : ""}
                  </div>
                </div>
              )}

              <div className="text-red-400 text-xs">{errorMessage}</div>

              <div
                className={`flex flex-col gap-2 sm:items-center sm:mt-7 ${
                  !selectedOption && "mt-7"
                }`}
              >
                <button
                  className="btn btn-md w-full sm:w-3/4 sm:text-lg bg-secondary hover:bg-secondary hover:border-secondary hover:opacity-85"
                  onClick={handleCreateOrder}
                  disabled={!isActive || !selectedOption?.quantity}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-md w-full sm:w-3/4 sm:text-lg hover:border-primary hover:opacity-85"
                  disabled={!isActive}
                  onClick={handleAddFavoriteItem}
                >
                  Favourite ♥︎
                </button>
              </div>
            </div>
          </div>

          {/*Product Details*/}
          <div className="flex flex-col mt-5">
            <div className="border-t-1 border-black py-3 sm:py-4">
              <button
                className="flex justify-between w-full text-lg sm:text-2xl font-medium sm:px-10"
                onClick={() => setIsOpenProductDetails(!isOpenProductDetails)}
              >
                <div>Product Details</div>
                <div>{`${isOpenProductDetails ? "-" : "+"}`}</div>
              </button>

              {isOpenProductDetails && (
                <div className="mt-2 sm:px-10">
                  <p className="font-light">{description}</p>

                  <ul className="list-disc ml-5 mt-2 sm:mt-5">
                    <li>Brand: {brandName}</li>
                    <li>Type: {typeName}</li>
                  </ul>

                  <Image
                    src={
                      brandName === "Adidas"
                        ? adidasLogo
                        : brandName === "Asics"
                        ? asicsLogo
                        : brandName === "Converse"
                        ? converseLogo
                        : brandName === "Fila"
                        ? filaLogo
                        : brandName === "Jordan"
                        ? jordanLogo
                        : brandName === "New-Balance"
                        ? newBalanceLogo
                        : brandName === "Nike"
                        ? nikeLogo
                        : brandName === "Puma"
                        ? pumaLogo
                        : brandName === "Reebok"
                        ? reebokLogo
                        : brandName === "Timberland"
                        ? timberlandLogo
                        : vansLogo
                    }
                    className="w-20 sm:w-32"
                    alt="brand-logo"
                    width={0}
                    height={0}
                  />
                </div>
              )}
            </div>

            {/*Product Reviews*/}
            <div className="border-y-1 border-black py-3 sm:py-4">
              <button
                className="flex justify-between w-full text-lg sm:text-2xl font-medium sm:px-10"
                onClick={() => setIsOpenProductReviews(!isOpenProductReviews)}
              >
                <div>Product Reviews</div>
                <div>{`${isOpenProductReviews ? "-" : "+"}`}</div>
              </button>

              {isOpenProductReviews && (
                <div className="mt-5">
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-medium sm:text-xl mb-3 sm:mb-5 sm:px-10">
                      PRODUCT RATING
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:w-full sm:gap-10">
                      <div className="text-sm sm:text-lg sm:w-1/2 sm:h-[140px] sm:flex flex-col justify-center items-center">
                        <div className="flex flex-row gap-2 sm:gap-4 sm:justify-center">
                          <div className="text-yellow-400">★★★★★</div>
                          <div className="text-teal-500 underline">
                            {reviews.length > 0 ? averageScore : 0} out of 5
                          </div>
                        </div>

                        <div className="w-full">
                          <div className="font-light text-center">
                            Based on {reviews.length} {`reviews`}
                          </div>
                        </div>

                        <div className="w-full">
                          <div className="text-teal-500 underline text-center">
                            collected by Scottish
                          </div>
                        </div>
                      </div>

                      <div className="text-sm sm:text-lg mt-5 sm:mt-0 sm:w-1/2 sm:h-140px sm:flex flex-col items-center">
                        <div className="flex gap-2 sm:gap-4">
                          <div className="text-yellow-400">★★★★★</div>
                          <div>
                            {countScore.filter((score) => score === 5).length}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                          <div className="text-yellow-400">
                            ★★★★<span className="text-slate-300">★</span>
                          </div>
                          <div>
                            {countScore.filter((score) => score === 4).length}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                          <div className="text-yellow-400">
                            ★★★<span className="text-slate-300">★★</span>
                          </div>
                          <div>
                            {countScore.filter((score) => score === 3).length}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                          <div className="text-yellow-400">
                            ★★<span className="text-slate-300">★★★</span>
                          </div>
                          <div>
                            {countScore.filter((score) => score === 2).length}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                          <div className="text-yellow-400">
                            ★<span className="text-slate-300">★★★★</span>
                          </div>
                          <div>
                            {countScore.filter((score) => score === 1).length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="w-full my-3 sm:my-5" />

                    {/* ส่วนสำหรับเขียน review (จะแสดงเมื่อเคยซื้อ product นี้มาก่อน) */}
                    {id !== 0 && userBoughtThisProduct.length > 0 && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:gap-20 w-full sm:px-32">
                          <div className="sm:w-1/2">
                            <textarea
                              className="border w-full h-24 sm:h-24 resize-none rounded-lg px-2 py-1 text-sm sm:text-base"
                              placeholder="Write your review"
                              onChange={(e) => setReviewText(e.target.value)}
                              value={reviewText}
                            >
                              {reviewText}
                            </textarea>

                            <div className="flex items-center gap-1">
                              <div className="text-sm sm:text-base">
                                Rating Score:
                              </div>

                              <div className="rating rating-sm">
                                <input
                                  type="radio"
                                  name="rating-1"
                                  className="mask mask-star bg-yellow-400"
                                  onClick={() => setRatingScore(1)}
                                />
                                <input
                                  type="radio"
                                  name="rating-1"
                                  className="mask mask-star bg-yellow-400"
                                  onClick={() => setRatingScore(2)}
                                />
                                <input
                                  type="radio"
                                  name="rating-1"
                                  className="mask mask-star bg-yellow-400"
                                  onClick={() => setRatingScore(3)}
                                />
                                <input
                                  type="radio"
                                  name="rating-1"
                                  className="mask mask-star bg-yellow-400"
                                  onClick={() => setRatingScore(4)}
                                />
                                <input
                                  type="radio"
                                  name="rating-1"
                                  className="mask mask-star bg-yellow-400"
                                  onClick={() => setRatingScore(5)}
                                  defaultChecked
                                />
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-1/2 sm:h-24 sm:flex flex-col justify-between">
                            <div className="flex mt-2 sm:mt-0 gap-2 sm:h-8">
                              <button
                                className="btn btn-xs sm:btn-sm"
                                onClick={() => setIsOpenUploadImage(true)}
                              >
                                <Image
                                  className="w-5 h-5"
                                  src={imageUploadIcon}
                                  alt="upload-image"
                                  width={0}
                                  height={0}
                                />
                              </button>

                              {uploadedImageLinks.length === 0 ? (
                                <div className="border w-full rounded-lg text-xs sm:text-sm flex items-center px-2 text-slate-400 h-6 sm:h-full">{`Upload your image`}</div>
                              ) : (
                                <div className="border w-full rounded-lg text-xs sm:text-sm flex flex-col items-center px-2 text-slate-400 h-6 sm:h-full overflow-scroll">
                                  {uploadedImageLinks.map((image, index) => (
                                    <div
                                      key={`image${index}`}
                                      className="w-full text-nowrap my-1 flex items-center"
                                    >
                                      <div className="w-[90%] sm:w-3/4">
                                        {`${String(index + 1)}. ${
                                          image.imageUrl.length > 32
                                            ? image.imageUrl.substring(0, 32) +
                                              "..."
                                            : image.imageUrl
                                        }`}
                                      </div>

                                      <button
                                        onClick={() =>
                                          handleDeleteImageLink(image.imageUrl)
                                        }
                                      >
                                        <Image
                                          className="w-3 h-3 sm:w-4 sm:h-4"
                                          src={closeIcon}
                                          alt="delete-image"
                                          height={0}
                                          width={0}
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {isOpenUploadImage && (
                                <div className="absolute bg-white flex flex-col items-start border rounded-lg sm:w-80">
                                  <div className="w-full flex justify-between items-end px-1">
                                    <div className="text-[11px] sm:text-xs text-red-500 pt-0.5">
                                      * Maximum 4 images
                                    </div>
                                    <button
                                      className="hover:bg-slate-200 rounded-lg"
                                      onClick={() => {
                                        setIsOpenUploadImage(false);
                                        setIsOpenUplodeFromLink(false);
                                      }}
                                    >
                                      <Image
                                        className="w-3 h-3"
                                        src={closeIcon}
                                        alt="upload-from-device"
                                        width={0}
                                        height={0}
                                      />
                                    </button>
                                  </div>

                                  <div className="relative w-full">
                                    <button className="relative btn font-normal bg-white border border-white w-full flex items-center justify-start gap-2 px-3 py-2 text-sm sm:text-base">
                                      <Image
                                        className="w-4 h-4"
                                        src={uplodeFromDeviceIcon}
                                        alt="upload-from-device"
                                        width={0}
                                        height={0}
                                      />
                                      <span className="text-sm sm:text-base">
                                        Upload from my device
                                      </span>
                                      <input
                                        className="absolute left-0 w-full h-full opacity-0"
                                        type="file"
                                        accept="image/*"
                                      />
                                    </button>

                                    <button
                                      className="btn font-normal bg-white border border-white w-full flex items-center justify-start gap-2 px-3 py-2 text-sm sm:text-base"
                                      onClick={() =>
                                        setIsOpenUplodeFromLink(true)
                                      }
                                    >
                                      <Image
                                        className="w-4 h-4"
                                        src={uplodeFromLinkIcon}
                                        alt="upload-from-device"
                                        width={0}
                                        height={0}
                                      />
                                      <span className="text-sm sm:text-base">
                                        Upload by image address
                                      </span>
                                    </button>

                                    {isOpenUplodeFromLink && (
                                      <div className="absolute top-0 w-full rounded-b-md h-fit flex flex-col bg-white px-3 py-1">
                                        <button
                                          className="flex w-fit"
                                          onClick={() =>
                                            setIsOpenUplodeFromLink(false)
                                          }
                                        >
                                          <Image
                                            className="w-3 h-4"
                                            src={leftArrowIcon}
                                            alt="go-back-icon"
                                            width={0}
                                            height={0}
                                          />
                                        </button>

                                        <div className="flex flex-col gap-3 h-full">
                                          <input
                                            className="border rounded-md px-2 w-full text-sm sm:text-base"
                                            type="text"
                                            placeholder="ImageUrl"
                                            value={imageLink}
                                            onChange={(e) =>
                                              setImageLink(e.target.value)
                                            }
                                          />

                                          <div className="w-full flex justify-center">
                                            <button
                                              className="btn btn-xs bg-secondary w-3/4 text-sm sm:text-base rounded-lg"
                                              onClick={handleUploadImageLink}
                                              disabled={
                                                uploadedImageLinks.length === 4
                                              }
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              className="btn btn-sm bg-secondary w-full h-9 mt-2"
                              onClick={handleSubmitReview}
                              disabled={reviewText.length === 0}
                            >
                              Submit
                            </button>
                          </div>
                        </div>

                        <hr className="w-full my-3 sm:my-5" />
                      </>
                    )}

                    {reviews.length > 0 ? (
                      <div className="text-sm sm:text-base h-[420px] sm:h-[515px] overflow-scroll sm:px-10">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-t-0 border-l-0 border-r-0 w-full px-2 pt-2"
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 sm:w-8 sm:h-8 border overflow-hidden rounded-full bg-slate-300">
                                <img
                                  className=""
                                  src={review.User.profileImage}
                                  alt="user-image"
                                />
                              </div>
                              <div className="text-sm sm:text-base">
                                {`${
                                  review.User.firstName
                                } ${review.User.lastName.substring(0, 1)}.`}
                              </div>
                            </div>

                            <div className="text-yellow-400 text-xs sm:text-sm my-2 sm:my-3">
                              {review.ratingScore === 5
                                ? "★★★★★"
                                : review.ratingScore === 4
                                ? "★★★★"
                                : review.ratingScore === 3
                                ? "★★★"
                                : review.ratingScore === 2
                                ? "★★"
                                : "★"}
                            </div>

                            <div className="mb-2 sm:mb-3">
                              {review.reviewContent}
                            </div>

                            <div className="text-xs sm:text-sm opacity-50">
                              Product Option:{" "}
                              {review.productOption.map(
                                (option) =>
                                  option.ProductOption.optionName + " "
                              )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                              {review.reviewImages.map((image, index) => (
                                <img
                                  key={index}
                                  className="w-full sm:w-3/4 h-[110px] sm:h-[120px]"
                                  src={image.imageUrl}
                                  alt="shoes-image"
                                />
                              ))}
                            </div>

                            <div className="text-[9px] sm:text-[12px] opacity-50 pt-2 sm:pt-6">
                              <div>
                                Create At: {review.createdAt.split("T")[0]}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm sm:text-base h-[420px] sm:h-[515px] sm:px-10">
                        This product has no reviews
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
