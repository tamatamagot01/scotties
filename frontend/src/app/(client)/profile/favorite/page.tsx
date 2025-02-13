/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import Navbar from "@/components/Navbar";
import deleteIcon from "@public/assets/icons/admin/reject.png";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteFavoriteItem, getFavoriteItem } from "@/apis/user";
import { useUserStore } from "@/store/zustand";

type ProductType = {
  Product: {
    id: number;
    imageUrl: string;
    productName: string;
    brand: {
      id: number;
      name: string;
    };
    type: {
      id: number;
      typeName: string;
    };
  };
};

export default function FavoriteItem() {
  const { id } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);

  const [favoriteItems, setFavoriteItems] = useState<ProductType[]>([]);

  if (favoriteItems.length !== 0) {
    console.log(33, favoriteItems);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getFavoriteItem(id);

        setFavoriteItems(res.data);
      } catch (error: any) {
        console.error("Error to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteFavoriteItem = async (productId: number) => {
    try {
      const res = await deleteFavoriteItem(productId);
      alert(res.data.message);
    } catch (error) {
      console.error("Error to delete item", error);
    } finally {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center">
        <div className="text-lg sm:text-2xl font-medium mt-5">
          Favorite items
        </div>

        {favoriteItems.length === 0 && (
          <div className="mt-5">No favorite item</div>
        )}

        <div className="w-full px-5 mt-3 sm:px-60 flex flex-col gap-3">
          {favoriteItems.map((item) => (
            <div
              key={item.Product.productName}
              className="relative sm:flex items-center border w-full rounded-xl overflow-hidden sm:px-2 sm:py-1"
            >
              <button onClick={() => handleDeleteFavoriteItem(item.Product.id)}>
                <Image
                  className="absolute top-1 right-2 w-4 h-4 sm:w-6 sm:h-6"
                  src={deleteIcon}
                  alt="delete-icon"
                />
              </button>
              <Link
                href={`/store/product/${item.Product.type.typeName}?product-id=${item.Product.id}`}
                className="w-full sm:w-fit flex justify-center sm:block"
              >
                <img
                  className="w-40 h-28 sm:w-72 sm:h-40 "
                  src={item.Product.imageUrl}
                  alt="product-image"
                />
              </Link>

              <Link
                href={`/store/product/${item.Product.type.typeName}?product-id=${item.Product.id}`}
                className="w-full sm:flex justify-center"
              >
                <div className="pl-2 pb-2 sm:pl-0 sm:pb-0 text-base sm:text-lg sm:w-[80%]">
                  <div className="sm:hidden">
                    {item.Product.productName.length > 30
                      ? item.Product.productName.substring(0, 30) + "..."
                      : item.Product.productName}
                  </div>
                  <div className="hidden sm:block">
                    {item.Product.productName}
                  </div>
                  <div>{`Brand: ${item.Product.brand.name}`}</div>
                  <div>{`Type: ${item.Product.type.typeName}`}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
