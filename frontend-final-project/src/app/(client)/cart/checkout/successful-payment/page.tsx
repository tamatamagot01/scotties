"use client";

import {
  checkPaymentStatus,
  successfulPayment,
  successfulPaymentNotLogin,
} from "@/apis/payment";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@public/assets/decorations/logo-3.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOrderStore, useUserStore } from "@/store/zustand";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { id } = useUserStore();

  const sessionId = searchParams.get("session_id") as string;
  const userId = searchParams.get("user_id") as string;
  const orderId = searchParams.get("order_id") as string;
  const couponId = searchParams.get("coupon_id") as string;

  const [isLoading, setIsLoading] = useState(true);

  const [isOpenHomepageButton, setIsOpenHomepageButton] = useState(false);

  // ดึง order มาจาก localStorage สำหรับ user ที่ไม่ login
  const { thisOrders, clearOrder } = useOrderStore();

  useEffect(() => {
    // กรณี user ที่ไม่ได้ login
    if (id === 0 && thisOrders.length !== 0) {
      const fetchData = async () => {
        try {
          const res = await successfulPaymentNotLogin({
            session_id: sessionId,
            order_id: orderId,
          });

          const thisOrder = res.data;

          // หาก status ของ order เป็น complete (จ่ายเงินแล้ว) -> ก็ทำการลบข้อมูล order ใน localStorage ได้เลย
          if (thisOrder.status === "complete") {
            clearOrder();
          }
        } catch (error) {
          console.error("Error to fetch data", error);
        } finally {
          setTimeout(() => {
            // ตรงนี้ไว้แก้เป็น redirect to homepage
            setIsLoading(false);
            setIsOpenHomepageButton(true);
            // router.replace("/");
          }, 5000);
        }
      };

      fetchData();

      return;
    }

    // หากไม่มี sessionId และ orderId ส่งมากับ queryParams จะ push ไปหน้า home
    if (!sessionId || !orderId) {
      console.error("Missing sessionId or orderId");
      router.push("/");
      return;
    }

    // กรณี user login
    if (id !== 0) {
      const fetchData = async () => {
        try {
          // เช็คก่อนว่า orderId นี้ status complete ไปแล้วยัง (เพื่อป้องกันการลบสินค้าใน stock ซ้ำซ้อน)
          const paymentStatus = await checkPaymentStatus({ orderId });
          const isComplete = paymentStatus.data.status;
          if (isComplete === "complete") {
            return;
          }

          // หาก status ไม่ใช่ complete
          // ส่ง session_id เป็น searchParams ไปเพื่อจะเอา session_id ไปหา status ของการจ่ายเงินใน function testPayment
          await successfulPayment({
            session_id: sessionId,
            user_id: userId,
            order_id: orderId,
            coupon_id: couponId,
          });
        } catch (error) {
          console.error("Error to fetch data", error);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
            setIsOpenHomepageButton(true);
          }, 5000);
        }
      };
      fetchData();
    }
  }, [thisOrders, sessionId, orderId]);

  const loadingComponent = () => {
    return <span className="loading loading-spinner loading-lg"></span>;
  };

  return (
    <div className="bg-primary font-fredoka text-text min-h-screen w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <Image
          className="w-full"
          src={Logo}
          height={Logo.height}
          width={Logo.width}
          alt="Logo"
        />
        <div className="text-lg">Payment completed successfully</div>
        {!isOpenHomepageButton && (
          <div className="text-sm">Redirecting you to the homepage</div>
        )}
        <div>{isLoading && loadingComponent()}</div>
        {isOpenHomepageButton && (
          <button
            className="btn btn-sm sm:btn btn-ghost bg-secondary hover:bg-darkSecondary sm:btn-ghost sm:bg-secondary sm:hover:bg-darkSecondary sm:text-primary text-primary"
            onClick={() => router.replace("/")}
          >
            Back to homepage
          </button>
        )}
      </div>
    </div>
  );
}
