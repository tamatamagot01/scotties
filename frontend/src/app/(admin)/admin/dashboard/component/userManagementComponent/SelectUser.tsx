import React, { useEffect, useState } from "react";
import closeButton from "@public/assets/icons/admin/reject.png";
import leftArrow from "@public/assets/icons/arrow-small-left.svg";
import { defaultUserValue } from "../UserManagement";
import Image from "next/image";
import { UserType } from "../UserManagement";
import { deleteUser, editUserByAdmin, getUserByUserId } from "@/apis/user";
import { AxiosError } from "axios";

export default function SelectUser({
  userId,
  onSelectedUser,
}: {
  userId: number;
  onSelectedUser: (user: UserType) => void;
}) {
  // fetch product
  const [thisUser, setThisUser] = useState<UserType>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserByUserId({ userId });

        setThisUser(res.data);
      } catch (error) {
        console.error("Error to fetch user", error);
      }
    };

    fetchUser();
  }, [userId]);

  // จัดการ message (success & fail ไว้ใช้ตอน alert)
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");

  // จัดการการ edit user
  const [isEditUser, setIsEditUser] = useState(false);

  const [selectedEdit, setSelectedEdit] = useState("");

  const [editContent, setEditContent] = useState("");

  const handleClickEdit = async () => {
    setIsEditUser(!isEditUser);
  };

  const handleConfirmEdit = async () => {
    try {
      const res = await editUserByAdmin({
        userId,
        editType: selectedEdit,
        editContent,
      });

      setSuccessMessage(res.data.message);
      setThisUser(res.data.editedUser);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error to edit user", error);
        setFailMessage(error.response?.data.error || "Request failed");
      } else {
        console.error("Error to edit user", error);
        setFailMessage("An unexpected error occurred.");
      }
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  // จัดการการ delete product
  const [clickedDelete, setClickedDelete] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteUser({
        userId,
        status: "delete",
      });

      setSuccessMessage(res.data.message);
      setThisUser(res.data.deletedUser);
      setClickedDelete(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error to delete product", error);
        setFailMessage(error.response?.data.error || "Request failed");
      } else {
        console.error("Error to delete product", error);
        setFailMessage("An unexpected error occurred.");
      }
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  // จัดการกรณีอยากให้ product กลับมา available
  const handleConfirmAvailable = async () => {
    try {
      const res = await deleteUser({
        userId,
        status: "available",
      });

      setSuccessMessage(res.data.message);
      setThisUser(res.data.deletedUser);
      setClickedDelete(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error to available this product", error);
        setFailMessage(error.response?.data.error || "Request failed");
      } else {
        console.error("Error to available this product", error);
        setFailMessage("An unexpected error occurred.");
      }
    } finally {
      setInterval(() => {
        setSuccessMessage("");
        setFailMessage("");
      }, 5000);
    }
  };

  return (
    thisUser && (
      <div className="sm:mx-3">
        <div className="hidden sm:flex justify-between gap-2 sm:my-3">
          <div className="flex gap-2">
            <button className="btn sm:btn-xs">{`<`}</button>
            <button className="btn sm:btn-xs">{`>`}</button>
          </div>

          <div className="flex gap-2">
            {!clickedDelete && thisUser.isActive && (
              <>
                <button className="btn sm:btn-xs" onClick={handleClickEdit}>
                  Edit User
                </button>
                <button
                  className="btn sm:btn-xs btn-error"
                  onClick={() => setClickedDelete(true)}
                >
                  Delete User
                </button>
              </>
            )}
            {clickedDelete && thisUser.isActive && (
              <>
                <button
                  className="btn sm:btn-xs btn-error"
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="btn sm:btn-xs btn-info"
                  onClick={() => setClickedDelete(false)}
                >
                  Not Now
                </button>
              </>
            )}
            {!thisUser.isActive && (
              <>
                <button
                  className="btn btn-xs btn-success"
                  onClick={handleConfirmAvailable}
                >
                  Change user to available
                </button>
              </>
            )}
          </div>
        </div>

        <div className="sm:relative py-2 bg-indigo-100 sm:rounded-lg">
          <button
            className="w-full flex sm:absolute top-0 right-0 justify-end p-1"
            onClick={() => onSelectedUser(defaultUserValue)}
          >
            <Image
              className="w-4"
              src={closeButton}
              alt="close-button"
              width={0}
              height={0}
            />
          </button>

          {successMessage !== "" && (
            <div className="flex justify-center">
              <div
                role="alert"
                className="absolute alert alert-success z-10 w-fit sm:px-10"
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
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {failMessage !== "" && (
            <div className="flex justify-center">
              <div
                role="alert"
                className="absolute alert alert-error z-10 w-fit sm:px-10"
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
                <span>{failMessage}</span>
              </div>
            </div>
          )}

          <div className="sm:flex gap-5 sm:px-5">
            <div className="flex justify-center items-center">
              <img
                className="w-44 h-40"
                src={thisUser.profileImage}
                alt="user-image"
              />
            </div>

            <div
              className={`overflow-x-auto sm:w-[80%] ${
                !thisUser.isActive && "opacity-40"
              }`}
            >
              <table className="table">
                <tbody>
                  <tr className="hover">
                    <th>ID:</th>
                    <td>{thisUser.id}</td>
                  </tr>
                  <tr className="hover">
                    <th>First Name:</th>
                    <td>{thisUser.firstName}</td>
                  </tr>
                  <tr className="hover">
                    <th>Last Name:</th>
                    <td>{thisUser.lastName}</td>
                  </tr>
                  <tr className="hover">
                    <th>Email:</th>
                    <td>{thisUser.email}</td>
                  </tr>
                  <tr className="hover">
                    <th>Role:</th>
                    <td>{thisUser.role.roleName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden px-3 flex justify-center gap-2">
            {!clickedDelete && thisUser.isActive && (
              <>
                <button className="btn btn-sm" onClick={handleClickEdit}>
                  Edit User
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => setClickedDelete(true)}
                >
                  Delete User
                </button>
              </>
            )}
            {clickedDelete && thisUser.isActive && (
              <>
                <button
                  className="btn btn-sm btn-error"
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => setClickedDelete(false)}
                >
                  Not Now
                </button>
              </>
            )}
            {!thisUser.isActive && (
              <>
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleConfirmAvailable}
                >
                  Change user to available
                </button>
              </>
            )}
          </div>
        </div>

        <div className="w-full px-1 sm:px-0">
          <div className="stats shadow overflow-scroll w-full mt-3">
            {thisUser.addresses.map((address, index) => (
              <div key={index} className="stat p-3 sm:p-2">
                <div className="stat-title text-sm">{address.phoneNumber}</div>
                <div className="stat-value text-lg">
                  {address.province}{" "}
                  <span className="stat-desc text-xs">Items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEditUser && selectedEdit === "" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3">
            <div className="text-lg sm:text-xl mb-3 font-semibold">
              Select Edit
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("firstName")}
              >
                First Name
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("lastName")}
              >
                Last Name
              </button>
              <button
                className="btn btn-sm sm:btn"
                onClick={() => setSelectedEdit("role")}
              >
                Role
              </button>
            </div>
          </div>
        )}

        {selectedEdit === "firstName" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">
                Edit First Name
              </div>
            </div>

            <input
              type="text"
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "lastName" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">
                Edit Last Name
              </div>
            </div>

            <input
              type="text"
              placeholder="Type here"
              className="input input-sm input-bordered w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}

        {selectedEdit === "role" && (
          <div className="flex flex-col items-center bg-indigo-100 sm:rounded-lg mt-3 py-3 px-3">
            <div className="relative">
              <button
                className="absolute left-0 -translate-x-[200%] top-1/2 -translate-y-1/2 border border-black rounded-full"
                onClick={() => setSelectedEdit("")}
              >
                <Image
                  className="w-3 h-3"
                  src={leftArrow}
                  alt="back-icon"
                  width={0}
                  height={0}
                />
              </button>

              <div className="text-lg sm:text-xl font-semibold">Edit Role</div>
            </div>

            <select
              className="select select-sm w-full max-w-xs mt-2"
              onChange={(e) => setEditContent(e.target.value)}
            >
              <option disabled selected>
                Select Role
              </option>
              <option value={"customer"}>Customer</option>
              <option value={"admin"}>Admin</option>
              <option value={"manager"}>Manager</option>
            </select>
            <button className="btn btn-sm mt-4" onClick={handleConfirmEdit}>
              Confirm Edit
            </button>
          </div>
        )}
      </div>
    )
  );
}
