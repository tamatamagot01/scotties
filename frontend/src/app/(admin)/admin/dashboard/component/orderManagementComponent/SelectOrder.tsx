import React, { useEffect, useState } from "react";
import closeButton from "@public/assets/icons/admin/reject.png";
import Image from "next/image";
import { OrderType, defaultOrderValue } from "../OrderManagement";
import { getOrderByOrderIdAndOrderType } from "@/apis/order";

export default function SelectOrder({
  orderId,
  onSelectedOrder,
}: {
  orderId: number;
  onSelectedOrder: (order: OrderType) => void;
}) {
  // fetch order
  const [thisOrder, setThisOrder] = useState<OrderType>();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByOrderIdAndOrderType({
          orderId: String(orderId),
          orderType: "member",
        });

        setThisOrder(res.data);
      } catch (error) {
        console.error("Error to fetch order", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  console.log(thisOrder);

  return (
    thisOrder && (
      <div className="sm:mx-3">
        <div className="hidden sm:flex justify-start gap-2 sm:my-3">
          <div className="flex gap-2">
            <button className="btn sm:btn-xs">{`<`}</button>
            <button className="btn sm:btn-xs">{`>`}</button>
          </div>
        </div>

        <div className="sm:relative py-2 bg-indigo-100 sm:rounded-lg">
          <button
            className="w-full flex sm:absolute top-0 right-0 justify-end p-1"
            onClick={() => onSelectedOrder(defaultOrderValue)}
          >
            <Image
              className="w-4"
              src={closeButton}
              alt="close-button"
              width={0}
              height={0}
            />
          </button>

          <div className="sm:flex gap-5 sm:px-5">
            <div className="overflow-x-auto sm:w-[80%]">
              <table className="table">
                <tbody>
                  <tr className="hover">
                    <th>ID:</th>
                    <td>{thisOrder.id}</td>
                  </tr>
                  <tr className="hover">
                    <th>Customer Name:</th>
                    <td>{`${thisOrder.user.firstName} ${thisOrder.user.lastName}`}</td>
                  </tr>
                  <tr className="hover">
                    <th>Status:</th>
                    <td>{thisOrder.status}</td>
                  </tr>
                  <tr className="hover">
                    <th>Total Amount:</th>
                    <td>{thisOrder.totalAmount}</td>
                  </tr>
                  <tr className="hover">
                    <th>Used Coupon:</th>
                    <td>
                      {thisOrder.orderUsedCoupon.length > 0
                        ? thisOrder.orderUsedCoupon[0].Coupon.couponName
                        : "Doesn't use a coupon"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full px-1 sm:px-0">
          <div className="stats shadow overflow-scroll w-full mt-3">
            {thisOrder.products.map((product, index) => (
              <div key={index} className="stat p-3 sm:p-2">
                <div className="stat-title text-sm">
                  {product.product.productName}
                </div>
                <div className="stat-title text-sm">
                  {product.option.optionName}
                </div>
                <div className="stat-value text-lg">
                  {product.quantity}{" "}
                  <span className="stat-desc text-xs">
                    {product.quantity > 1 ? "Items" : "Item"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
