/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./component/sidebar/Sidebar";
import { useRouter } from "next/navigation";
import { profile } from "@/apis/user";
import { useUserStore } from "@/store/zustand";
import AdminHome from "./component/AdminHome";
import ProductManagement from "./component/ProductManagement";
import UserManagement from "./component/UserManagement";
import OrderManagement from "./component/OrderManagement";

export default function Dashboard() {
  const { setUser } = useUserStore();

  // สำหรับ mobile-size ใช้เปิดปิด hamburger menu
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false); //ป้องกันไม่ให้ user (ที่ role = 1) ที่ login จากหน้าร้านมาเข้าส่วน admin นี้

  const getProfile = async () => {
    try {
      const admin = await profile();
      const roleId = admin.data.roleId;

      setUser(admin.data); // นำ admin data ไปเก็บใน local storage ด้วย zustand

      if (roleId === 2 || roleId === 3) {
        setIsAuthorized(true);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      router.replace("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [router]);

  const [isSelect, setIsSelect] = useState({
    home: true,
    product: false,
    user: false,
    order: false,
  });

  const handleIsSelect = (selected: string) => {
    setIsSelect({
      home: false,
      product: false,
      user: false,
      order: false,
      [selected]: true,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  //ป้องกันไม่ให้ user (ที่ role = 1) ที่ login จากหน้าร้านมาเข้าส่วน admin นี้
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-indigo-100">
      {/* side-bar */}
      <Sidebar
        onSelect={handleIsSelect}
        selected={isSelect}
        isOpenMenu={isOpenMenu}
        setIsOpenMenu={setIsOpenMenu}
      />

      {isSelect.home ? (
        <AdminHome />
      ) : isSelect.product ? (
        <ProductManagement />
      ) : isSelect.user ? (
        <UserManagement />
      ) : (
        <OrderManagement />
      )}
    </div>
  );
}
