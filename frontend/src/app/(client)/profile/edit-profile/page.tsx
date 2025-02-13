"use client";

import { editUserByUser, getAddressByUserId } from "@/apis/user";
import leftArrow from "@public/assets/icons/arrow-small-left.svg";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/zustand";

type FetchAddressType = {
  id: number;
  userId: number;
  streetAddress: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  isActive: boolean;
};

export default function EditProfile() {
  const { id } = useUserStore();

  const [userName, setUserName] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [userAddress, setUserAddress] = useState({
    streetAddress: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
    userId: 0,
    addressId: 0,
  });
  const [selectedAddress, setSelectedAddress] = useState(0);

  const [userFetchAddress, setUserFetchAddress] =
    useState<FetchAddressType[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAddressByUserId();
        setUserFetchAddress(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const [selectedEdit, setSelectedEdit] = useState({
    selectName: false,
    selectProfileImage: false,
    selectAddress: false,
  });

  const handleSelectEdit = (select: string) => {
    setSelectedEdit((prev: Record<string, boolean>) => ({
      selectName: false,
      selectProfileImage: false,
      selectAddress: false,
      [select]: !prev[select],
    }));

    setUserImageUrl("");
  };

  const [selectedEditName, setSelectedEditName] = useState({
    selectFirstName: false,
    selectLastName: false,
  });

  const handleSelectEditName = (select: string) => {
    setSelectedEditName((prev: Record<string, boolean>) => ({
      selectFirstName: false,
      selectLastName: false,
      [select]: !prev[select],
    }));

    setUserName("");
  };

  const [selectedEditAdress, setSelectedEditAdress] = useState({
    selectAdd: false,
    selectEdit: false,
    selectDelete: false,
  });

  const handleSelectEditAddress = (select: string) => {
    setSelectedEditAdress((prev: Record<string, boolean>) => ({
      selectAdd: false,
      selectEdit: false,
      selectDelete: false,
      [select]: !prev[select],
    }));

    setUserAddress({
      streetAddress: "",
      subDistrict: "",
      district: "",
      province: "",
      postalCode: "",
      phoneNumber: "",
      userId: 0,
      addressId: 0,
    });

    setSelectedAddress(0);

    setEditThisAddress({
      editStreetAddress: false,
      editSubDistrict: false,
      editDistrict: false,
      editProvince: false,
      editPostalCode: false,
      editPhoneNumber: false,
    });
  };

  const [editThisAddress, setEditThisAddress] = useState({
    editStreetAddress: false,
    editSubDistrict: false,
    editDistrict: false,
    editProvince: false,
    editPostalCode: false,
    editPhoneNumber: false,
  });

  const handleSelectEditThisAddress = (select: string) => {
    setEditThisAddress((prev: Record<string, boolean>) => ({
      editStreetAddress: false,
      editSubDistrict: false,
      editDistrict: false,
      editProvince: false,
      editPostalCode: false,
      editPhoneNumber: false,
      [select]: !prev[select],
    }));
  };

  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (editType: string) => {
    try {
      let res;

      if (editType === "firstName" || editType === "lastName") {
        res = await editUserByUser({
          userId: id,
          editType,
          editContent: userName,
        });
      }

      if (editType === "imageUrl") {
        res = await editUserByUser({
          userId: id,
          editType,
          editContent: userImageUrl,
        });
      }

      if (editType === "addAddress") {
        res = await editUserByUser({
          userId: id,
          editType,
          editContent: userAddress,
        });
      }

      if (editType === "editAddress") {
        res = await editUserByUser({
          userId: id,
          editType,
          editContent: { ...userAddress, selectedAddress },
        });
      }

      if (editType === "deleteAddress") {
        res = await editUserByUser({
          userId: id,
          editType,
          editContent: selectedAddress,
        });
      }

      if (res) {
        console.log(res.data);
        setAlertMessage(res.data.message);
      }
    } catch (error) {
      console.error("Error to submit the data", error);
    } finally {
      setTimeout(() => {
        setAlertMessage("");
        window.location.reload();
      }, 5000);
    }
  };

  return (
    <div className="font-fredoka">
      <Navbar />

      <div className={`ml-2 mt-2 sm:ml-40 sm:mt-10`}>
        <Link href={"/profile"} className={`btn btn-xs sm:btn-sm sm:text-md`}>
          Back to Profile
        </Link>
      </div>

      {alertMessage !== "" && (
        <div className="absolute w-full z-10">
          <div role="alert" className="alert alert-success">
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
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${
          selectedEditAdress.selectAdd
            ? "mt-20"
            : selectedAddress && selectedEditAdress.selectEdit
            ? "mt-10"
            : "mt-32"
        } justify-center items-center`}
      >
        {!(
          selectedEdit.selectName ||
          selectedEdit.selectProfileImage ||
          selectedEdit.selectAddress
        ) && (
          <>
            <div className={`text-lg font-medium mb-4 sm:text-3xl`}>
              Edit Profile
            </div>

            <div className="flex flex-col justify-center items-center gap-2 ">
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56 ${
                  selectedEdit.selectName ? "bg-darkSecondary" : "bg-secondary"
                }`}
                onClick={() => handleSelectEdit("selectName")}
              >
                Edit Name
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56 ${
                  selectedEdit.selectProfileImage
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEdit("selectProfileImage")}
              >
                Edit Profile image
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56 ${
                  selectedEdit.selectAddress
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEdit("selectAddress")}
              >
                Edit Address
              </button>
            </div>
          </>
        )}

        {!selectedEditName.selectFirstName &&
          !selectedEditName.selectLastName &&
          selectedEdit.selectName && (
            <div>
              <div className="relative text-center text-lg font-medium mb-4 w-44 sm:text-3xl sm:w-72">
                <button
                  className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                  onClick={() => handleSelectEdit("selectName")}
                >
                  <Image
                    className="sm:w-[30px] sm:h-[30px]"
                    src={leftArrow}
                    alt="back-icon"
                    width={20}
                    height={20}
                  />
                </button>
                Edit Name
              </div>

              <div className="flex flex-col sm:items-center gap-2">
                <button
                  className="btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56 bg-secondary"
                  onClick={() => handleSelectEditName("selectFirstName")}
                >
                  Edit First Name
                </button>
                <button
                  className="btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56  bg-secondary"
                  onClick={() => handleSelectEditName("selectLastName")}
                >
                  Edit Last Name
                </button>
              </div>
            </div>
          )}

        {selectedEditName.selectFirstName && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-72">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEditName("selectFirstName")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Edit First Name
            </div>
            <input
              type="text"
              className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
              onChange={(e) => setUserName(e.target.value)}
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("firstName")}
                disabled={userName === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {selectedEditName.selectLastName && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-72">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEditName("selectLastName")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Edit Last Name
            </div>
            <input
              type="text"
              className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
              onChange={(e) => setUserName(e.target.value)}
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("lastName")}
                disabled={userName === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {selectedEdit.selectProfileImage && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-80">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEdit("selectProfileImage")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Edit Profile Image
            </div>
            <input
              type="text"
              className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
              placeholder="imageUrl"
              value={userImageUrl}
              onChange={(e) => setUserImageUrl(e.target.value)}
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-smsm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("imageUrl")}
                disabled={userImageUrl === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {!selectedEditAdress.selectAdd &&
          !selectedEditAdress.selectEdit &&
          !selectedEditAdress.selectDelete &&
          selectedEdit.selectAddress && (
            <div>
              <div className="relative text-center text-lg font-medium mb-4 w-44 sm:text-3xl sm:w-72">
                <button
                  className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                  onClick={() => handleSelectEdit("selectAddress")}
                >
                  <Image
                    className="sm:w-[30px] sm:h-[30px]"
                    src={leftArrow}
                    alt="back-icon"
                    width={20}
                    height={20}
                  />
                </button>
                Edit Address
              </div>

              <div className="flex flex-col sm:items-center gap-2">
                <button
                  className="btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56  bg-secondary"
                  onClick={() => handleSelectEditAddress("selectAdd")}
                >
                  Add new address
                </button>
                <button
                  className="btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56  bg-secondary"
                  onClick={() => handleSelectEditAddress("selectEdit")}
                >
                  Edit address
                </button>
                <button
                  className="btn btn-sm sm:btn-md sm:text-lg w-44 sm:w-56  bg-secondary"
                  onClick={() => handleSelectEditAddress("selectDelete")}
                >
                  Delete address
                </button>
              </div>
            </div>
          )}

        {selectedEditAdress.selectAdd && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-72">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEditAddress("selectAdd")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Add new address
            </div>

            <div className="flex flex-col gap-1 sm:gap-3">
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="Street Address"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    streetAddress: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="Sub District"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    subDistrict: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="District"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="Province"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    province: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="Postal Code"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border rounded-lg px-2 sm:w-full sm:h-10 sm:text-lg"
                placeholder="Phone Number"
                onChange={(e) =>
                  setUserAddress((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("addAddress")}
                disabled={
                  userAddress.streetAddress === "" ||
                  userAddress.subDistrict === "" ||
                  userAddress.district === "" ||
                  userAddress.province === "" ||
                  userAddress.postalCode === "" ||
                  userAddress.phoneNumber === ""
                }
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {selectedEditAdress.selectEdit && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-72">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEditAddress("selectEdit")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Edit address
            </div>

            <select
              className="w-56 border rounded-lg px-1 sm:w-72 sm:h-10"
              onChange={(e) => setSelectedAddress(Number(e.target.value))}
            >
              {userFetchAddress?.map((address) => (
                <option value={address.id} key={address.streetAddress}>
                  {address.streetAddress +
                    " " +
                    address.subDistrict +
                    " " +
                    address.district +
                    " " +
                    address.province +
                    " " +
                    address.postalCode +
                    " " +
                    address.phoneNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedAddress !== 0 && selectedEditAdress.selectEdit && (
          <div className="mt-3 sm:mt-7">
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editStreetAddress
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editStreetAddress")}
              >
                Edit Street Address
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editSubDistrict
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editSubDistrict")}
              >
                Edit Sub District
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editDistrict
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editDistrict")}
              >
                Edit District
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editProvince
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editProvince")}
              >
                Edit Province
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editPostalCode
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editPostalCode")}
              >
                Edit Postal Code
              </button>
              <button
                className={`btn btn-sm sm:btn-md sm:text-lg w-28 sm:w-56 h-10 ${
                  editThisAddress.editPhoneNumber
                    ? "bg-darkSecondary"
                    : "bg-secondary"
                }`}
                onClick={() => handleSelectEditThisAddress("editPhoneNumber")}
              >
                Edit Phone Number
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editStreetAddress && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit Street Address</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: e.target.value,
                  subDistrict: "",
                  district: "",
                  province: "",
                  postalCode: "",
                  phoneNumber: "",
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.streetAddress === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editSubDistrict && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit Sub District</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: "",
                  subDistrict: e.target.value,
                  district: "",
                  province: "",
                  postalCode: "",
                  phoneNumber: "",
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.subDistrict === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editDistrict && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit District</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: "",
                  subDistrict: "",
                  district: e.target.value,
                  province: "",
                  postalCode: "",
                  phoneNumber: "",
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.district === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editProvince && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit Province</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: "",
                  subDistrict: "",
                  district: "",
                  province: e.target.value,
                  postalCode: "",
                  phoneNumber: "",
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.province === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editPostalCode && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit Postal Code</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: "",
                  subDistrict: "",
                  district: "",
                  province: "",
                  postalCode: e.target.value,
                  phoneNumber: "",
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.postalCode === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {editThisAddress.editPhoneNumber && (
          <div className="mt-3 sm:mt-7">
            <div className="text-center sm:text-xl">Edit Phone Number</div>
            <input
              type="text"
              className="border rounded-lg px-2 w-56 sm:w-72 sm:h-10 sm:text-lg"
              onChange={(e) =>
                setUserAddress(() => ({
                  streetAddress: "",
                  subDistrict: "",
                  district: "",
                  province: "",
                  postalCode: "",
                  phoneNumber: e.target.value,
                  userId: 0,
                  addressId: 0,
                }))
              }
            />

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("editAddress")}
                disabled={userAddress.phoneNumber === ""}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {selectedEditAdress.selectDelete && (
          <div>
            <div className="relative text-center text-lg font-medium mb-4 sm:text-3xl sm:w-72">
              <button
                className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2"
                onClick={() => handleSelectEditAddress("selectDelete")}
              >
                <Image
                  className="sm:w-[30px] sm:h-[30px]"
                  src={leftArrow}
                  alt="back-icon"
                  width={20}
                  height={20}
                />
              </button>
              Delete address
            </div>

            <select
              className="w-56 border rounded-lg px-1 sm:w-72 sm:h-10"
              onChange={(e) => setSelectedAddress(Number(e.target.value))}
            >
              {userFetchAddress?.map((address) => (
                <option value={address.id} key={address.streetAddress}>
                  {address.streetAddress +
                    " " +
                    address.subDistrict +
                    " " +
                    address.district +
                    " " +
                    address.province +
                    " " +
                    address.postalCode +
                    " " +
                    address.phoneNumber}
                </option>
              ))}
            </select>

            <div className="text-center mt-2 sm:mt-7">
              <button
                className="btn btn-sm sm:btn-md sm:text-lg w-32 sm:w-56 bg-secondary"
                onClick={() => handleSubmit("deleteAddress")}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
