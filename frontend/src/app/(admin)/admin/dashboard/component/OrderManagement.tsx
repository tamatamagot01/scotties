"use client";

import React, { useEffect, useState } from "react";
import filterIcon from "@public/assets/icons/filter.png";
import closeIcon from "@public/assets/icons/admin/reject.png";
import brandIcon from "@public/assets/icons/admin/brand.png";
import typeIcon from "@public/assets/icons/admin/tshirt.png";
import searchIcon from "@public/assets/icons/admin/search.png";
import Image from "next/image";
import { getOrderInRange } from "@/apis/order";
import OrderItem from "./orderManagementComponent/OrderItem";
import SelectOrder from "./orderManagementComponent/SelectOrder";

export type OrderType = {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  products: {
    product: { productName: string };
    option: { optionName: string };
    quantity: number;
  }[];
  orderUsedCoupon: {
    Coupon: { couponName: string };
  }[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: {
      roleName: string;
    };
  };
};

export const defaultOrderValue = {
  id: 0,
  userId: 0,
  totalAmount: 0,
  status: "",
  createdAt: "",
  products: [],
  orderUsedCoupon: [],
  user: {
    firstName: "",
    lastName: "",
    email: "",
    role: {
      roleName: "",
    },
  },
};

export default function OrderManagement() {
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filterResult, setFilterResult] = useState<number>();

  const [selectedOrder, setSelectedOrder] =
    useState<OrderType>(defaultOrderValue);

  // จัดการการ filter
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filter, setFilter] = useState({
    status: true,
    totalAmount: false,
  });

  // // status filter
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string[]>(
    []
  );

  const [selectedAllStatus, setSelectedAllStatus] = useState(false);

  const handleSelectedStatusFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedStatusFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedStatusFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // total amount filter
  const [selectedTotalAmountFilter, setSelectedTotalAmountFilter] = useState<
    string[]
  >([]);

  const [selectedAllTotalAmount, setSelectedAllTotalAmount] = useState(false);

  const handleSelectedTotalAmountFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedTotalAmountFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedTotalAmountFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // ปุ่ม reset filter
  const handleResetFilter = () => {
    setSelectedStatusFilter([]);
    setSelectedAllStatus(false);

    setSelectedTotalAmountFilter([]);
    setSelectedAllTotalAmount(false);
  };

  // // ปุ่ม find สำหรับ submit filter

  const [filterOrder, setFilterOrder] = useState({});

  const handleSubmitFilter = async () => {
    const filterObj = {
      status: {
        all: selectedAllStatus,
        value: [...selectedStatusFilter],
      },
      totalAmount: {
        all: selectedAllTotalAmount,
        value: [...selectedTotalAmountFilter],
      },
    };

    setFilterOrder(filterObj);
  };

  // จัดการการ sort ในแต่ละหมวด (asc = น้อย -> มาก, desc = มาก -> น้อย)
  const [sortOrder, setSortOrder] = useState("id,asc");

  const handleSortId = async () => {
    if (sortOrder === "id,asc") {
      setSortOrder("id,desc");
    } else {
      setSortOrder("id,asc");
    }
  };

  const handleSortStatus = async () => {
    if (sortOrder === "status,asc") {
      setSortOrder("status,desc");
    } else {
      setSortOrder("status,asc");
    }
  };

  const handleSortTotalAmount = async () => {
    if (sortOrder === "totalAmount,asc") {
      setSortOrder("totalAmount,desc");
    } else {
      setSortOrder("totalAmount,asc");
    }
  };

  const handleSortUserName = async () => {
    if (sortOrder === "userName,asc") {
      setSortOrder("userName,desc");
    } else {
      setSortOrder("userName,asc");
    }
  };

  // จัดการการ search order
  const [searchInput, setSearchInput] = useState("");
  const [searchOrder, setSearchOrder] = useState("");

  const handleSubmitSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOrder(searchInput);
    setPage(1);
  };

  // fetch orders ตาม page และ sort ที่เลือกมา
  useEffect(() => {
    const fetchSortedProducts = async () => {
      try {
        const res = await getOrderInRange({
          page,
          sortOrder,
          searchOrder,
          filterOrder,
        });

        setOrders(res.data.orders);
        setFilterResult(res.data.countOrders._count._all);
      } catch (error) {
        console.error("Error to sort price", error);
      }
    };

    fetchSortedProducts();
  }, [page, sortOrder, searchOrder, filterOrder]);

  return (
    <div className="relative w-full">
      {/* Product Controller Zone */}
      <div className="sm:flex justify-between gap-5 sm:mt-5 px-2 sm:px-5">
        <div className="relative sm:flex flex-row gap-5">
          <div className="sm:hidden w-full text-end my-2">
            {/* <button
              className="btn btn-xs border-0"
              onClick={() => setProductManagement("createProduct")}
            >
              Create Product
            </button> */}
          </div>

          {isOpenFilter && (
            <div className="absolute z-20 bg-white shadow rounded-lg w-full h-fit">
              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <div className="flex gap-1 items-center">
                  <Image
                    className="w-4 h-4"
                    src={filterIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Filter</div>
                </div>

                <button onClick={() => setIsOpenFilter(false)}>
                  <Image
                    className="w-4 h-4"
                    src={closeIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                </button>
              </div>

              <hr />

              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <button
                  className={`flex gap-1 items-center ${
                    filter.status && "border-b-2 border-indigo-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      status: true,
                      totalAmount: false,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={brandIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Status</div>
                </button>

                <button
                  className={`flex gap-1 items-center ${
                    filter.totalAmount && "border-b-2 border-emerald-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      status: false,
                      totalAmount: true,
                    })
                  }
                >
                  <Image
                    className="hidden sm:block w-4 h-4"
                    src={typeIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div>Total Amount</div>
                </button>
              </div>

              <hr />

              {(selectedAllStatus ||
                selectedAllTotalAmount ||
                selectedStatusFilter.length > 0 ||
                selectedTotalAmountFilter.length > 0) && (
                <div className="flex gap-1 items-center py-2 px-5 overflow-scroll">
                  {selectedAllStatus && (
                    <div className="bg-indigo-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllStatus && "All Status"}
                    </div>
                  )}

                  {!selectedAllStatus && (
                    <>
                      {selectedStatusFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-indigo-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}

                  {selectedAllTotalAmount && (
                    <div className="bg-emerald-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllTotalAmount && "All Type"}
                    </div>
                  )}

                  {!selectedAllTotalAmount && (
                    <>
                      {selectedTotalAmountFilter.map((filter, index) => (
                        <div
                          key={index}
                          className="border border-emerald-400 shadow px-2 rounded-xl whitespace-nowrap"
                        >
                          {filter}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {(selectedAllStatus ||
                selectedAllTotalAmount ||
                selectedStatusFilter.length > 0 ||
                selectedTotalAmountFilter.length > 0) && <hr />}

              {filter.status && (
                <div className="form-control grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-5 py-2">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">All Status</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={selectedAllStatus}
                      onChange={(e) => {
                        setSelectedAllStatus(e.target.checked ? true : false);
                      }}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Complete</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedStatusFilter.includes("complete") ||
                        selectedAllStatus
                      }
                      disabled={selectedAllStatus}
                      onChange={(e) =>
                        handleSelectedStatusFilter(e, "complete")
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Pending</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedStatusFilter.includes("pending") ||
                        selectedAllStatus
                      }
                      disabled={selectedAllStatus}
                      onChange={(e) => handleSelectedStatusFilter(e, "pending")}
                    />
                  </label>
                </div>
              )}

              {filter.totalAmount && (
                <div className="form-control grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-5 py-2">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">
                      All Total amount
                    </span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={selectedAllTotalAmount}
                      onChange={(e) =>
                        setSelectedAllTotalAmount(
                          e.target.checked ? true : false
                        )
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">1 - 5</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTotalAmountFilter.includes("1 - 5") ||
                        selectedAllTotalAmount
                      }
                      disabled={selectedAllTotalAmount}
                      onChange={(e) =>
                        handleSelectedTotalAmountFilter(e, "1 - 5")
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">6 - 10</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTotalAmountFilter.includes("6 - 10") ||
                        selectedAllTotalAmount
                      }
                      disabled={selectedAllTotalAmount}
                      onChange={(e) =>
                        handleSelectedTotalAmountFilter(e, "6 - 10")
                      }
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">{`> 10`}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedTotalAmountFilter.includes("> 10") ||
                        selectedAllTotalAmount
                      }
                      disabled={selectedAllTotalAmount}
                      onChange={(e) =>
                        handleSelectedTotalAmountFilter(e, "> 10")
                      }
                    />
                  </label>
                </div>
              )}

              <hr />

              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <button
                  className="btn btn-sm"
                  disabled={
                    !selectedAllStatus &&
                    !selectedAllTotalAmount &&
                    selectedStatusFilter.length === 0 &&
                    selectedTotalAmountFilter.length === 0
                  }
                  onClick={handleResetFilter}
                >
                  Reset
                </button>

                <button
                  className="btn btn-neutral btn-sm flex items-center gap-1"
                  disabled={
                    !selectedAllStatus &&
                    !selectedAllTotalAmount &&
                    selectedStatusFilter.length === 0 &&
                    selectedTotalAmountFilter.length === 0
                  }
                  onClick={handleSubmitFilter}
                >
                  <Image
                    className="w-4 h-4"
                    src={searchIcon}
                    alt="filter-icon"
                    width={0}
                    height={0}
                  />
                  <div className="text-sm sm:text-vase">Find</div>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              className="btn btn-sm"
              onClick={() => setIsOpenFilter(true)}
            >
              Filter
            </button>
            <form onSubmit={handleSubmitSearchOrder}>
              <input
                className="input input-sm input-bordered w-full sm:w-96 max-w-xs"
                type="text"
                placeholder="Search Product ID/ Name"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>

          <div className="mt-2 sm:mt-0 text-sm flex justify-center items-center">
            Filter result {filterResult} items
          </div>

          <div className="mt-1 sm:mt-0 flex gap-1 items-center justify-center">
            <button
              className="btn btn-xs"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >{`<`}</button>
            <input
              className="bg-white w-7 h-fit text-center rounded-lg"
              type="number"
              value={page}
              min={1}
              onChange={(e) => setPage(Number(e.target.value))}
            />
            <button
              className="btn btn-xs"
              onClick={() => setPage(page + 1)}
            >{`>`}</button>
          </div>
        </div>

        <div className="hidden sm:block">
          {/* <button
            className="btn btn-sm"
            onClick={() => setProductManagement("createProduct")}
          >
            Create Product
          </button> */}
        </div>
      </div>

      {/* Product Display Zone */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortId}
                >
                  <div>ID</div>
                  <div>
                    <div
                      className={`${
                        sortOrder === "id,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortOrder === "id,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortUserName}
                >
                  <div>Customer Name</div>
                  <div>
                    <div
                      className={`${
                        sortOrder === "userName,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortOrder === "userName,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortStatus}
                >
                  <div>Status</div>
                  <div>
                    <div
                      className={`${
                        sortOrder === "status,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortOrder === "status,asc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
              <th>
                <button
                  className="flex items-center gap-2"
                  onClick={handleSortTotalAmount}
                >
                  <div>Total Amount</div>
                  <div>
                    <div
                      className={`${
                        sortOrder === "totalAmount,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortOrder === "totalAmount,asc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                  </div>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                props={order}
                onSelectedOrder={setSelectedOrder}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder.id !== 0 && (
        <div className="absolute top-0 bg-indigo-200 w-full h-full">
          <SelectOrder
            orderId={selectedOrder.id}
            onSelectedOrder={setSelectedOrder}
          />
        </div>
      )}
    </div>
  );
}
