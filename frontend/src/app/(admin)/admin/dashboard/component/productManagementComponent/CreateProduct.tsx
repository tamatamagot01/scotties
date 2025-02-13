/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useProductManagementStore } from "@/store/zustand";
import {
  createProduct,
  getAllBrand,
  getAllOptionNames,
  getAllType,
} from "@/apis/productManagement";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

const productSchema = z.object({
  productName: z.string().min(1, { message: "Product Name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  imageUrl: z.string().min(1, { message: "ImageURL is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const defaultValues = {
  productName: "",
  brand: "Adidas",
  type: "Shoes",
  price: "",
  imageUrl: "",
  description: "",
};

const shoesOptionsDefaultValues = {
  US7: 0,
  "US7.5": 0,
  US8: 0,
  "US8.5": 0,
  US9: 0,
  "US9.5": 0,
  US10: 0,
  "US10.5": 0,
  US11: 0,
  "US11.5": 0,
  US12: 0,
  "US12.5": 0,
};

const shirtOptionsDefaultValues = {
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  "2XL": 0,
};

const accOptionsDefaultValues = {
  Red: 0,
  Blue: 0,
  Green: 0,
  White: 0,
  Black: 0,
  Yellow: 0,
};

export default function CreateProduct() {
  const { setProductManagement } = useProductManagementStore();
  const [brands, setBrands] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [shoesOptions, setShoesOptions] = useState(shoesOptionsDefaultValues);
  const [shirtOptions, setShirtOptions] = useState(shirtOptionsDefaultValues);
  const [accOptions, setAccOptions] = useState(accOptionsDefaultValues);

  const [selectedType, setSelectedType] = useState("");
  const [optionNames, setOptionNames] = useState<
    { id: number; name: string }[]
  >([]);
  const [isLoadingOptionName, setIsLoadingOptionName] = useState(false);

  // ดึง brand และ type มาใช้งานใน select จาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brands = await getAllBrand();
        const types = await getAllType();

        setBrands(brands.data.map((brand: any) => brand.name));
        setProductTypes(types.data.map((type: any) => type.typeName));

        setSelectedType("Shoes");
      } catch (error) {
        console.error("Error to fetch data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingOptionName(true);
        const optionNames = await getAllOptionNames({ typeName: selectedType });

        setOptionNames(optionNames.data);
      } catch (error) {
        console.error("Error to fetch data", error);
      } finally {
        setIsLoadingOptionName(false);
      }
    };
    fetchData();
  }, [selectedType]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (selectedType === "Shoes") {
        data.options = shoesOptions;
      } else if (selectedType === "Acc") {
        data.options = accOptions;
      } else {
        data.options = shirtOptions;
      }

      const res = await createProduct(data);
      alert(res.data.message);

      handleResetField();
      setSelectedType("Shoes");
    } catch (error: any) {
      console.error("Error: ", error);
      alert(error.response.data.error);
    }
  };

  const handleResetField = () => {
    reset(defaultValues);
  };

  return (
    <>
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-full sm:w-3/4 h-5/6 flex flex-col justify-center items-center rounded-xl sm:h-[90%] overflow-scroll">
        <button
          className="absolute top-2 right-3"
          onClick={() => setProductManagement("createProduct")}
        >
          <Image
            src="/assets/icons/admin/reject.png"
            alt="exit-button"
            width={0}
            height={0}
            className="w-6 h-6"
          />
        </button>
        <div className="text-2xl font-bold pb-7 mt-40 sm:mt-0">
          Create Product
        </div>
        <form
          className="flex flex-col justify-center sm:w-96 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col sm:flex-row justify-between">
            <label>Product Name</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="Product Name"
              {...register("productName")}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>Brand</label>
            <select className="w-60 border" {...register("brand")}>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>Type</label>
            <select
              className="w-60 border"
              {...register("type")}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setShoesOptions(shoesOptionsDefaultValues);
                setShirtOptions(shirtOptionsDefaultValues);
                setAccOptions(accOptionsDefaultValues);
              }}
              value={selectedType}
            >
              {productTypes.map((type: any) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>
              Option <span className="text-xs">{`(Blank = 0)`}</span>
            </label>
            {isLoadingOptionName ? (
              <div className="w-60 flex justify-center">
                <span className="loading loading-dots loading-xs"></span>
              </div>
            ) : (
              <div className="grid grid-cols-3 text-sm w-60">
                {optionNames.map((option) => (
                  <div className="border w-fit" key={option.id}>
                    <div className="text-center border-b-1">{option.name}</div>
                    <input
                      className="w-full text-xs text-center"
                      type="number"
                      placeholder="quantity"
                      onChange={(e) =>
                        selectedType === "Shoes"
                          ? setShoesOptions((prev) => ({
                              ...prev,
                              [option.name]: Number(e.target.value),
                            }))
                          : selectedType === "Acc"
                          ? setAccOptions((prev) => ({
                              ...prev,
                              [option.name]: Number(e.target.value),
                            }))
                          : setShirtOptions((prev) => ({
                              ...prev,
                              [option.name]: Number(e.target.value),
                            }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>Price</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="Price"
              {...register("price")}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>ImageURL</label>
            <input
              className="w-60 border pl-1"
              type="text"
              placeholder="ImageURL"
              {...register("imageUrl")}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <label>Description</label>
            <textarea
              className="w-60 h-20 border resize-none pl-1"
              placeholder="Description"
              {...register("description")}
            />
          </div>

          {/* พื้นที่แสดง error กรณีไม่ได้กรอกฟอร์มทุก input */}
          {errors ? (
            <div className="text-red-400 text-xs sm:text-sm sm:flex justify-center">
              {errors.productName?.message ||
                errors.brand?.message ||
                errors.type?.message ||
                errors.price?.message ||
                errors.imageUrl?.message ||
                errors.description?.message}
            </div>
          ) : (
            <div></div>
          )}

          <div className="w-full flex justify-center items-center gap-4">
            <button
              className="btn btn-sm"
              type="button"
              onClick={handleResetField}
            >
              Clear data
            </button>
            <button className="btn btn-sm" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
