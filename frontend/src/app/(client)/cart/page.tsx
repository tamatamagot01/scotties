/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import removeIcon from "@public/assets/icons/admin/reject.png";
import {
  getOrderByUserId,
  getOrderForUserNotLogin,
  removeProductInOrder,
} from "@/apis/order";
import { useUserStore, useOrderStore } from "@/store/zustand";
import Footer from "@/components/Footer";

export type OrderType = {
  id: number;
  totalAmount: number;
  option: {
    optionName: string;
  };
  product: {
    id: number;
    productName: string;
    brand: {
      id: number;
      name: string;
    };
    price: number;
    imageUrl: string;
  };
  quantity: number;
};

export default function Page() {
  const { id } = useUserStore();

  const [orders, setOrders] = useState([]);

  const [orderId, setOrderId] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const { thisOrders, deleteOrderItem } = useOrderStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id === 0 && thisOrders.length > 0) {
          // กรณีไม่ได้ Login
          // แปลง array ของ thisOrders เป็น string เพื่อส่งให้ API ใช้
          const encodedOrders = encodeURIComponent(JSON.stringify(thisOrders));

          const res = await getOrderForUserNotLogin({ orders: encodedOrders });

          const data = res.data;

          const orders = data.map((order: any, index: number) => ({
            product: {
              imageUrl: order.imageUrl,
              productName: order.productName,
              price: order.price,
              id: order.id,
              brand: { name: order.brand.name },
            },
            option: { optionName: order.productOptions[0].optionName },
            quantity: thisOrders[index].quantity,
          }));

          setOrders(orders);

          const totalAmount = thisOrders.reduce(
            (acc, cur) => cur.quantity + acc,
            0
          );
          setTotalAmount(totalAmount);
        } else {
          // กรณี Login
          const res = await getOrderByUserId({ userId: id });

          const products = res.data.products;
          const orderId = res.data.id;
          const totalAmount = res.data.totalAmount;

          setOrders(products);
          setOrderId(orderId);
          setTotalAmount(totalAmount);

          // หาวิธีจัดการหาก orderStatus === "complete ก็ไม่ต้องเอามาแสดงแล้ว"
        }
      } catch (error) {
        console.error("Error to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, thisOrders]);

  const handleRemoveProduct = async (orderId: number, productId: number) => {
    try {
      if (id !== 0) {
        await removeProductInOrder({
          orderId,
          productId,
          userId: id,
        });
      } else {
        deleteOrderItem(productId);
      }
    } catch (error) {
      console.error("Error to remove item", error);
    } finally {
      window.location.reload();
    }
  };

  // function สำหรับจัดฟอร์มตัวเลขให้มี "," (ตรง Total)
  const totalCalculator = () => {
    const total = orders.reduce(
      (acc, cur: OrderType) => cur.quantity * cur.product.price + acc,
      0
    );
    const newTotal = String(total)
      .split("")
      .reverse()
      .map((num, index) => (index % 3 === 0 && index !== 0 ? num + "," : num))
      .reverse()
      .join("");

    return newTotal;
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

      <div className="px-5 mb-5 font-fredoka min-h-screen">
        <div className="my-3">
          <div className="font-semibold">Shopping Bag</div>
          <div className="text-sm">
            <span className="font-medium">{orders.length} items</span> in your
            bag. <span className="font-medium">Totals: {totalAmount}</span>
          </div>
        </div>

        <hr />

        <div className="sm:flex flex-col justify-center items-center">
          <div className="flex flex-col gap-1 my-7 sm:w-1/2">
            {orders.map((order: OrderType, index: number) => (
              <div
                className="relative flex items-center border border-secondary rounded-xl p-1"
                key={index}
              >
                <img
                  className="w-24"
                  src={order.product.imageUrl}
                  alt={order.product.productName}
                />

                <div className="flex flex-col gap-1 w-40">
                  <div>
                    {order.product.productName.length > 15
                      ? order.product.productName.substring(0, 15) + "..."
                      : order.product.productName}
                    <span className="text-xs">{`(${order.option.optionName})`}</span>
                  </div>

                  <div className="text-xs flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-[13px]">
                        {order.quantity} {order.quantity > 1 ? "items" : "item"}
                      </div>
                    </div>
                    <div>
                      {String(order.product.price)
                        .split("")
                        .reverse()
                        .map((num, index) =>
                          index % 3 === 0 && index !== 0 ? num + "," : num
                        )
                        .reverse()
                        .join("")}
                      THB/1
                    </div>
                  </div>
                  <Link
                    href={`/store/product/${order.product.brand.name.toLowerCase()}?product-id=${
                      order.product.id
                    }`}
                    className="text-[12px] underline"
                  >
                    Change quantity
                  </Link>
                </div>

                <button
                  className="absolute top-1 right-1"
                  onClick={() => handleRemoveProduct(orderId, order.product.id)}
                >
                  <Image
                    className="w-3"
                    src={removeIcon}
                    alt="remove-item-icon"
                    height={0}
                    width={0}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="border border-secondary rounded-xl p-2 sm:w-1/2">
            <div className="font-medium text-center">Order Summary</div>

            <hr />

            <div className="text-sm">
              {orders.map((order: OrderType, index: number) => (
                <div className="flex justify-between" key={index}>
                  <div>
                    {order.product.productName.length > 20
                      ? order.product.productName.substring(0, 20) + "..."
                      : order.product.productName}
                    <span className="text-xs">{`(${order.option.optionName})`}</span>
                  </div>
                  <div>
                    {String(order.product.price * order.quantity)
                      .split("")
                      .reverse()
                      .map((num, index) =>
                        index % 3 === 0 && index !== 0 ? num + "," : num
                      )
                      .reverse()
                      .join("")}
                    THB
                  </div>
                </div>
              ))}
            </div>

            <hr />

            <div className="font-medium flex justify-between">
              <div>Total</div>
              <div>
                {totalCalculator()}
                THB
              </div>
            </div>
          </div>

          <div className="w-full mt-4 sm:w-1/2">
            {orders.length > 0 && (
              <Link href={"/cart/checkout"}>
                <button className="btn w-full bg-secondary hover:bg-secondary hover:opacity-85">
                  Process Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
