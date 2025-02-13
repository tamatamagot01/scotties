/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, useOrderStore } from "@/store/zustand";
import { getOrderByUserId, getOrderForUserNotLogin } from "@/apis/order";
import { userCreateAddress, getAddressByUserId } from "@/apis/user";
import { createPayment, createPaymentNotLogin } from "@/apis/payment";
import { findCoupon } from "@/apis/order";
import { OrderType } from "../page";
import AsyncSelect from "react-select/async";
import Footer from "@/components/Footer";

type FetchAddressType = {
  id: number;
  district: string;
  phoneNumber: string;
  postalCode: string;
  province: string;
  streetAddress: string;
  subDistrict: string;
  userId: number;
};

export default function Page() {
  const router = useRouter();

  const { id } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);

  const [isOpenAddNewAddress, setIsOpenAddNewAddress] = useState(false);

  const [orders, setOrders] = useState([]);

  const [orderId, setOrderId] = useState(0);

  // สำหรับ user ที่ login และไม่ login
  const [addressData, setAddressData] = useState({
    streetAddress: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
  });

  // กรณี user ที่ login และสร้าง address ไว้แล้ว
  const [selectedAddress, setSelectedAddress] = useState(0);

  // กรณี user ที่ไม่ login
  const [customerData, setCustomerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    wantNews: false,
  });
  // กรณี user ที่ไม่ login
  const [confirmAddressStatus, setConfirmAddressStatus] = useState(false);

  // ดึง order มาจาก localStorage แทน สำหรับ user ที่ไม่ login
  const { thisOrders } = useOrderStore();

  const [inputCoupon, setInputCoupon] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(false);

  const [couponName, setCouponName] = useState("");

  const subTotal = orders.reduce(
    (acc, cur: OrderType) => cur.product.price * cur.quantity + acc,
    0
  );

  const totalAmount = orders.reduce(
    (acc, cur: OrderType) => cur.quantity + acc,
    0
  );

  const [discount, setDiscount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shippingCost, setShippingCost] = useState(50);

  // ราคาสุทธิหลังใช้คูปอง และรวมค่าส่ง
  const [totalPrice, setTotalPrice] = useState("");

  const [couponId, setCouponId] = useState(0);

  const handleApplyCoupon = async () => {
    try {
      const res = await findCoupon({ couponCode: inputCoupon, userId: id });

      const coupons: {
        id: number;
        couponName: string;
        couponCode: string;
        discount: number;
      } = res.data;

      if (coupons) {
        if (coupons.couponName === "Free Shipping") {
          setDiscount(coupons.discount);
          setCouponName(coupons.couponName);
          setAppliedCoupon(!appliedCoupon);
          setCouponId(coupons.id);
        } else {
          const calculateDiscount = subTotal * (coupons.discount / 100);
          setDiscount(calculateDiscount);
          setCouponName(coupons.couponName);
          setAppliedCoupon(!appliedCoupon);
          setCouponId(coupons.id);
        }
      }
    } catch (error: any) {
      console.error("Error to check this coupon", error);
      alert(error.response.data.error);
    }
  };

  const [createdAddress, setCreatedAddress] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);

        if (id === 0 && thisOrders.length > 0) {
          const encodedOrders = encodeURIComponent(JSON.stringify(thisOrders));
          const res = await getOrderForUserNotLogin({ orders: encodedOrders });

          const ordersData = res.data;

          const orders = ordersData.map((order: any, index: number) => ({
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

          // ใช้จัดการเครื่องหมาย "," ใน Total Price
          const totalPrice = String(subTotal - discount + shippingCost)
            .split("")
            .reverse()
            .map((num, index, arr) =>
              (index + 1) % 3 === 0 && index !== arr.length - 1
                ? "," + num
                : num
            )
            .reverse()
            .join("");

          setTotalPrice(totalPrice);
        } else {
          const res = await getOrderByUserId({ userId: id });

          setOrders(res.data.products);
          setOrderId(res.data.id);

          // ใช้จัดการเครื่องหมาย "," ใน Total Price
          const totalPrice = String(subTotal - discount + shippingCost)
            .split("")
            .reverse()
            .map((num, index, arr) =>
              (index + 1) % 3 === 0 && index !== arr.length - 1
                ? "," + num
                : num
            )
            .reverse()
            .join("");

          setTotalPrice(totalPrice);
        }
      } catch (error) {
        console.error("Error to fetch order", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, thisOrders, subTotal, discount, shippingCost]);

  // สำหรับ user ที่ login แล้ว
  const handleCreateAddress = async () => {
    try {
      const res = await userCreateAddress(addressData);
      setCreatedAddress(true);

      if (res) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error to create new address", error);
    } finally {
      setTimeout(() => {
        setCreatedAddress(false);
      }, 5000);
    }
  };

  // สำหรับ user ที่ไม่ได้ login
  const handleConfirmAddress = () => {
    if (customerData.email === "") {
      alert("Please fill your email");
    }

    if (
      customerData.email !== "" &&
      customerData.firstName !== "" &&
      customerData.lastName !== "" &&
      addressData.streetAddress !== "" &&
      addressData.subDistrict !== "" &&
      addressData.district !== "" &&
      addressData.province !== "" &&
      addressData.postalCode !== "" &&
      addressData.phoneNumber !== ""
    ) {
      setConfirmAddressStatus(true);
    }
  };

  // สำหรับ user ที่ไม่ได้ login
  const handleConfirmPaymentNotLogin = async () => {
    const res = await createPaymentNotLogin({
      addressData,
      customerData,
      thisOrders,
    });

    const paymentUrl = res.data;
    router.replace(paymentUrl);
  };

  // สำหรับ user ที่ login แล้ว
  const handleConfirmPayment = async () => {
    if (selectedAddress) {
      const res = await createPayment({
        userAddressId: selectedAddress,
        userOrderId: orderId,
        userId: id,
        couponId,
      });

      const paymentUrl = res.data;
      router.replace(paymentUrl);
    }
  };

  // load-option สำหรับ select address (เฉพาะ user ที่ login)
  const loadOptions = async () => {
    const address = await getAddressByUserId();
    const addressData = address.data;

    return addressData.map((address: FetchAddressType) => ({
      label:
        address.streetAddress +
        " " +
        address.subDistrict +
        " " +
        address.district,
      value: address.id,
    }));
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
        {/* Checkout Header */}
        <div className="my-3">
          <div className="font-semibold">Checkout</div>
          <div className="text-sm">
            <span className="font-medium">
              {orders.length} {orders.length > 1 ? "items " : "item "}
            </span>
            in your bag.{" "}
            <span className="font-medium">Totals: {totalAmount} </span>
          </div>
        </div>
        <hr />

        <div className="sm:w-full sm:flex flex-col justify-center items-center">
          <div className="sm:w-1/2">
            {/* Coupon */}
            {id ? (
              <div className="my-5 sm:w-full">
                <div className="font-medium">Coupon</div>
                <div className="flex justify-between items-center">
                  <input
                    className="border w-3/4 text-sm p-1 rounded-md"
                    type="text"
                    placeholder="Gift card or coupon"
                    onChange={(e) => setInputCoupon(e.target.value)}
                    value={inputCoupon}
                    disabled={appliedCoupon}
                  />
                  <button
                    className="btn btn-xs  bg-secondary hover:bg-secondary hover:opacity-85"
                    onClick={handleApplyCoupon}
                  >
                    {appliedCoupon ? "Remove Coupon" : "Apply"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-5 sm:w-full"></div>
            )}

            {/* Order Summary */}
            <div className="border border-secondary rounded-xl p-2 sm:w-full">
              <div className="font-medium text-center">Order Summary</div>

              <hr />

              <div className="text-sm">
                {orders.map((order: OrderType, index: number) => (
                  <div className="flex justify-between" key={index}>
                    <div>
                      {order.product.productName.substring(0, 15) + "..."}
                      <span className="text-xs">{`(${order.option.optionName})`}</span>
                      <span>x{order.quantity}</span>
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

              <div className="text-[12px] flex justify-between">
                <div>Sub Total</div>
                <div>
                  {String(subTotal)
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
              {appliedCoupon && (
                <div className="text-[12px] flex justify-between">
                  <div>{couponName}</div>
                  <div>
                    -
                    {String(discount)
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
              )}
              <div className="text-[12px] flex justify-between">
                <div>Shipping (EMS)</div>
                <div>{shippingCost}THB</div>
              </div>
              <hr />
              <div className="font-medium flex justify-between">
                <div>Total</div>
                <div>{totalPrice}THB</div>
              </div>
            </div>

            {/* Address กรณีที่ user ไม่ได้ login */}
            <div className="sm:w-full">
              {!id && !confirmAddressStatus && (
                <>
                  <div className="flex flex-col gap-1 my-5">
                    <div className="">
                      <div className="font-medium">Contact Information</div>
                      <div className="text-xs">
                        Already have an account?{" "}
                        <Link href={"/login"} className="underline">
                          Log in
                        </Link>
                      </div>
                    </div>

                    <input
                      className="border w-full text-sm p-1 rounded-md"
                      type="text"
                      placeholder="Email"
                      value={customerData.email}
                      onChange={(e) =>
                        setCustomerData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />

                    <div className="text-xs flex gap-1">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        checked={customerData.wantNews}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            wantNews: e.target.checked,
                          }))
                        }
                      />
                      <div>Email me with news and offers</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium">Shipping Address</div>

                    <div className="text-sm mt-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex w-full gap-1">
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="First Name"
                            value={customerData.firstName}
                            onChange={(e) =>
                              setCustomerData((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                          />
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="Last Name"
                            value={customerData.lastName}
                            onChange={(e) =>
                              setCustomerData((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Street Address"
                          value={addressData.streetAddress}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              streetAddress: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Sub District"
                          value={addressData.subDistrict}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              subDistrict: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="District"
                          value={addressData.district}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              district: e.target.value,
                            }))
                          }
                        />
                        <div className="flex gap-1">
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="Province"
                            value={addressData.province}
                            onChange={(e) =>
                              setAddressData((prev) => ({
                                ...prev,
                                province: e.target.value,
                              }))
                            }
                          />
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="Zip Code"
                            value={addressData.postalCode}
                            onChange={(e) =>
                              setAddressData((prev) => ({
                                ...prev,
                                postalCode: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Phone"
                          value={addressData.phoneNumber}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="w-full flex justify-center items-center mt-4">
                        <div
                          className="btn btn-sm bg-secondary hover:bg-secondary hover:opacity-85"
                          onClick={handleConfirmAddress}
                        >
                          Confirm this address
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!id && confirmAddressStatus && (
                <div className="border border-secondary rounded-xl p-2 mt-5">
                  <div className="font-medium text-center">
                    Your shipping address
                  </div>

                  <hr />

                  <div className="text-sm px-2 py-1">
                    <div className="font-medium">
                      Customer Name:{" "}
                      <span className="font-normal">
                        {customerData.firstName + " " + customerData.lastName}
                      </span>
                    </div>
                    <div className="font-medium">
                      Email:{" "}
                      <span className="font-normal">{customerData.email}</span>
                    </div>
                    <div className="font-medium">
                      Street Address:{" "}
                      <span className="font-normal">
                        {addressData.streetAddress}
                      </span>
                    </div>
                    <div className="font-medium">
                      Sub District:{" "}
                      <span className="font-normal">
                        {addressData.subDistrict}
                      </span>
                    </div>
                    <div className="font-medium">
                      District:{" "}
                      <span className="font-normal">
                        {addressData.district}
                      </span>
                    </div>
                    <div className="font-medium">
                      Province:{" "}
                      <span className="font-normal">
                        {addressData.province}
                      </span>
                    </div>
                    <div className="font-medium">
                      Zip Code:{" "}
                      <span className="font-normal">
                        {addressData.postalCode}
                      </span>
                    </div>
                    <div className="font-medium">
                      Phone Number:{" "}
                      <span className="font-normal">
                        {addressData.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-xs"
                      onClick={() => setConfirmAddressStatus(false)}
                    >
                      Edit Shipping Address
                    </button>
                  </div>
                </div>
              )}

              {!id && confirmAddressStatus && (
                <div className="w-full mt-4">
                  <button
                    className="btn w-full bg-secondary hover:bg-secondary hover:opacity-85"
                    onClick={handleConfirmPaymentNotLogin}
                  >
                    Payment
                  </button>
                </div>
              )}
            </div>

            {/* Address กรณีที่ user ได้ login */}
            <div className="w-full">
              {id ? (
                <div className="mt-5">
                  <div className="font-medium">Address</div>

                  <div className="text-xs">Select your address</div>

                  <AsyncSelect
                    loadOptions={loadOptions}
                    defaultOptions
                    cacheOptions
                    onChange={(e: { label: string; value: number } | null) => {
                      if (e) {
                        setSelectedAddress(e.value);
                      }
                    }}
                  />

                  <div className="w-full flex justify-center items-center">
                    {createdAddress && (
                      <div
                        role="alert"
                        className="alert alert-success absolute max-w-fit "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 shrink-0 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Your address has been created!</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="text-xs underline"
                    onClick={() => setIsOpenAddNewAddress(!isOpenAddNewAddress)}
                  >
                    Add new address +
                  </button>

                  {isOpenAddNewAddress && (
                    <div className="text-sm mt-3">
                      <div className="flex flex-col gap-2">
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Street Address"
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              streetAddress: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Sub District"
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              subDistrict: e.target.value,
                            }))
                          }
                        />
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="District"
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              district: e.target.value,
                            }))
                          }
                        />
                        <div className="flex gap-1">
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="Province"
                            onChange={(e) =>
                              setAddressData((prev) => ({
                                ...prev,
                                province: e.target.value,
                              }))
                            }
                          />
                          <input
                            className="border w-1/2 p-0.5 pl-1 rounded-md"
                            type="text"
                            placeholder="Zip Code"
                            onChange={(e) =>
                              setAddressData((prev) => ({
                                ...prev,
                                postalCode: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <input
                          className="border p-0.5 pl-1 rounded-md"
                          type="text"
                          placeholder="Phone"
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="w-full flex justify-center items-center mt-4">
                        <div
                          className="btn btn-sm bg-secondary hover:bg-secondary hover:opacity-85"
                          onClick={handleCreateAddress}
                        >
                          Create new address
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}

              {!isOpenAddNewAddress && id ? (
                <div className="w-full mt-4">
                  <button
                    className="btn w-full bg-secondary hover:bg-secondary hover:opacity-85"
                    onClick={handleConfirmPayment}
                  >
                    Payment
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
