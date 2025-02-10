"use client";

import React, { useEffect, useState } from "react";
import { useUserManagementStore } from "@/store/zustand";
import filterIcon from "@public/assets/icons/filter.png";
import closeIcon from "@public/assets/icons/admin/reject.png";
import brandIcon from "@public/assets/icons/admin/brand.png";
import searchIcon from "@public/assets/icons/admin/search.png";
import Image from "next/image";
import CreateUser from "./userManagementComponent/CreateUser";
import { getUserInRange } from "@/apis/user";
import UserItem from "./userManagementComponent/UserItem";
import SelectUser from "./userManagementComponent/SelectUser";

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  isActive: boolean;
  addresses: {
    id: number;
    phoneNumber: string;
    streetAddress: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    isActive: boolean;
  }[];
  role: {
    id: number;
    roleName: string;
  };
  FavoriteItem: {
    productId: number;
  }[];
  reviews: {
    id: number;
    productId: number;
    ratingScore: number;
    reviewContent: string;
    createdAt: string;
  }[];
};

export const defaultUserValue = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  profileImage: "",
  isActive: true,
  addresses: [],
  orders: [],
  usedCoupon: {
    orderId: 0,
    usedAt: "",
    Coupon: {
      couponName: "",
    },
  },
  role: {
    id: 0,
    roleName: "",
  },
  FavoriteItem: [],
  reviews: [],
};

export default function UserManagement() {
  const { createUser, setUserManagement } = useUserManagementStore();

  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<UserType[]>([]);
  const [filterResult, setFilterResult] = useState<number>();

  const [selectedUser, setSelectedUser] = useState<UserType>(defaultUserValue);

  // จัดการการ filter
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filter, setFilter] = useState({
    role: true,
  });

  // // role filter
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string[]>([]);

  const [selectedAllRole, setSelectedAllRole] = useState(false);

  const handleSelectedRoleFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: string
  ) => {
    if (e.target.checked) {
      setSelectedRoleFilter((prevSelect) => [...prevSelect, filter]);
    } else {
      setSelectedRoleFilter((prevSelect) => [
        ...prevSelect.filter((select) => select !== filter),
      ]);
    }
  };

  // // ปุ่ม reset filter
  const handleResetFilter = () => {
    setSelectedRoleFilter([]);
    setSelectedAllRole(false);
  };

  // // ปุ่ม find สำหรับ submit filter

  const [filterUser, setFilterUser] = useState({});

  const handleSubmitFilter = async () => {
    const filterObj = {
      role: {
        all: selectedAllRole,
        value: [...selectedRoleFilter],
      },
    };

    setFilterUser(filterObj);
  };

  // จัดการการ sort ในแต่ละหมวด (asc = น้อย -> มาก, desc = มาก -> น้อย)
  const [sortUser, setSortUser] = useState("id,asc");

  const handleSortId = async () => {
    if (sortUser === "id,asc") {
      setSortUser("id,desc");
    } else {
      setSortUser("id,asc");
    }
  };

  const handleSortFirstName = async () => {
    if (sortUser === "firstName,asc") {
      setSortUser("firstName,desc");
    } else {
      setSortUser("firstName,asc");
    }
  };

  const handleSortLastName = async () => {
    if (sortUser === "lastName,asc") {
      setSortUser("lastName,desc");
    } else {
      setSortUser("lastName,asc");
    }
  };

  const handleSortEmail = async () => {
    if (sortUser === "email,asc") {
      setSortUser("email,desc");
    } else {
      setSortUser("email,asc");
    }
  };

  const handleSortRole = async () => {
    if (sortUser === "role,asc") {
      setSortUser("role,desc");
    } else {
      setSortUser("role,asc");
    }
  };

  // จัดการการ search user
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const handleSubmitSearchUser = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchUser(searchInput);
    setPage(1);
  };

  // fetch user ตาม page และ sort ที่เลือกมา
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUserInRange({
          page,
          sortUser,
          searchUser,
          filterUser,
        });

        setUsers(res.data.users);
        setFilterResult(res.data.countUsers._count._all);
      } catch (error) {
        console.error("Error to sort user", error);
      }
    };

    fetchUsers();
  }, [page, sortUser, searchUser, filterUser]);

  return (
    <div className="relative w-full">
      {/* Product Controller Zone */}
      <div className="sm:flex justify-between gap-5 sm:mt-5 px-2 sm:px-5">
        <div className="relative sm:flex flex-row gap-5">
          <div className="sm:hidden w-full text-end my-2">
            <button
              className="btn btn-xs border-0"
              onClick={() => setUserManagement("createUser")}
            >
              Create User
            </button>
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
                    filter.role && "border-b-2 border-indigo-400"
                  }`}
                  onClick={() =>
                    setFilter({
                      role: true,
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
                  <div>Role</div>
                </button>
              </div>

              <hr />

              {(selectedAllRole || selectedRoleFilter.length > 0) && (
                <div className="flex gap-1 items-center py-2 px-5 overflow-scroll">
                  {selectedAllRole && (
                    <div className="bg-indigo-300 shadow px-2 rounded-xl whitespace-nowrap">
                      {selectedAllRole && "All Role"}
                    </div>
                  )}

                  {!selectedAllRole && (
                    <>
                      {selectedRoleFilter.map((filter) => (
                        <div className="border border-indigo-400 shadow px-2 rounded-xl whitespace-nowrap">
                          {filter}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {(selectedAllRole || selectedRoleFilter.length > 0) && <hr />}

              {filter.role && (
                <div className="form-control grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 px-5 py-2">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">All Role</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={selectedAllRole}
                      onChange={(e) => {
                        setSelectedAllRole(e.target.checked ? true : false);
                      }}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Customer</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedRoleFilter.includes("customer") ||
                        selectedAllRole
                      }
                      disabled={selectedAllRole}
                      onChange={(e) => handleSelectedRoleFilter(e, "customer")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Admin</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedRoleFilter.includes("admin") || selectedAllRole
                      }
                      disabled={selectedAllRole}
                      onChange={(e) => handleSelectedRoleFilter(e, "admin")}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Manager</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs sm:checkbox-sm"
                      checked={
                        selectedRoleFilter.includes("manager") ||
                        selectedAllRole
                      }
                      disabled={selectedAllRole}
                      onChange={(e) => handleSelectedRoleFilter(e, "manager")}
                    />
                  </label>
                </div>
              )}

              <hr />

              <div className="flex gap-1 justify-between items-center py-2 px-5">
                <button
                  className="btn btn-sm"
                  disabled={!selectedAllRole && selectedRoleFilter.length === 0}
                  onClick={handleResetFilter}
                >
                  Reset
                </button>

                <button
                  className="btn btn-neutral btn-sm flex items-center gap-1"
                  disabled={!selectedAllRole && selectedRoleFilter.length === 0}
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
            <form onSubmit={handleSubmitSearchUser}>
              <input
                className="input input-sm input-bordered w-full sm:w-96 max-w-xs"
                type="text"
                placeholder="Search User ID/ Name"
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
          <button
            className="btn btn-sm"
            onClick={() => setUserManagement("createUser")}
          >
            Create User
          </button>
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
                        sortUser === "id,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortUser === "id,asc" ? "text-red-500" : "hidden"
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
                  onClick={handleSortFirstName}
                >
                  <div>First Name</div>
                  <div>
                    <div
                      className={`${
                        sortUser === "firstName,desc"
                          ? "text-red-500"
                          : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortUser === "firstName,asc" ? "text-red-500" : "hidden"
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
                  onClick={handleSortLastName}
                >
                  <div>Last Name</div>
                  <div>
                    <div
                      className={`${
                        sortUser === "lastName,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortUser === "lastName,asc" ? "text-red-500" : "hidden"
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
                  onClick={handleSortEmail}
                >
                  <div>Email</div>
                  <div>
                    <div
                      className={`${
                        sortUser === "email,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortUser === "email,asc" ? "text-red-500" : "hidden"
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
                  onClick={handleSortRole}
                >
                  <div>Role</div>
                  <div>
                    <div
                      className={`${
                        sortUser === "role,desc" ? "text-red-500" : "hidden"
                      }`}
                    >
                      ⌃
                    </div>
                    <div
                      className={`rotate-180 ${
                        sortUser === "role,asc" ? "text-red-500" : "hidden"
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
            {users.map((user) => (
              <UserItem
                key={user.id}
                props={user}
                onSelectedUser={setSelectedUser}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser.id !== 0 && (
        <div className="absolute top-0 bg-indigo-200 w-full h-full">
          <SelectUser
            userId={selectedUser.id}
            onSelectedUser={setSelectedUser}
          />
        </div>
      )}

      {createUser ? <CreateUser /> : null}
    </div>
  );
}
