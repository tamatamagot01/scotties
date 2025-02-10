/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { logout, profile } from "@/apis/user";
import { useUserStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import editIcon from "@public/assets/icons/edit-icon.svg";
import leftIcon from "@public/assets/icons/arrow-small-left.svg";
import rightIcon from "@public/assets/icons/arrow-small-right.svg";
import redRightIcon from "@public/assets/icons/arrow-small-right.png";
import exitIcon from "@public/assets/icons/exit.png";
import infoIcon from "@public/assets/icons/info.svg";
import passwordLock from "@public/assets/icons/password-lock.svg";
// import profileImage from "@public/assets/decorations/profile-image.jpg";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { firstName, lastName, profileImage, setUser, clearUser } =
    useUserStore();

  useEffect(() => {
    if (!firstName) {
      // ตรวจสอบว่ามีข้อมูลผู้ใช้แล้วหรือยัง
      profile()
        .then((response) => setUser(response.data))
        .then(() => setIsAuthorized(true))
        .catch(() => router.push("/login"))
        .finally(() => setIsLoading(false));
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, [firstName, setUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-secondary w-[10%]"></span>
      </div>
    );
  }

  // ป้องกันให้หากไม่ได้มีการ login จะไม่สามารถแวปเข้าไปดูหน้า profile ได้เลย
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="font-fredoka min-h-screen">
      <Navbar />
      {/* mobile-size */}
      <div className="relative flex justify-center items-center px-3 py-3 md:py-10">
        <Link
          href={"/"}
          className="absolute left-4 md:left-16 bg-secondary rounded-full w-5 h-5 flex justify-center items-center opacity-90"
        >
          <Image src={leftIcon} alt="left icon" width={12} height={12} />
        </Link>
        <div className="font-medium text-xl">Profile</div>
      </div>

      <div className="md:flex flex-row gap-6 md:px-14">
        <div className="relative px-3 md:w-1/2">
          <div className="flex justify-between items-start bg-secondary text-primary h-11 pt-1 px-3 rounded-t-xl">
            <div className="w-full">
              <div className="text-sm text-end">Purchase history ▸</div>
            </div>
          </div>

          <div className="relative flex flex-col justify-center items-center bg-primary rounded-xl -translate-y-3 py-4">
            <div className="bg-secondary w-[5.2rem] h-[5.2rem] rounded-full flex justify-center items-center">
              <img
                className="rounded-full w-[95%] h-[95%] object-cover"
                src={profileImage}
                alt="profile-image"
              />
            </div>

            <div className="text-text py-2">{`${firstName} ${lastName}`}</div>

            <Link
              href={"/profile/edit-profile"}
              className="absolute bg-secondary rounded-full p-1 right-2 top-2"
            >
              <Image src={editIcon} alt="edit-icon" width={12} height={12} />
            </Link>

            <div className="bg-text w-[90%] rounded-lg h-5 flex justify-between items-center px-4">
              <div className="flex justify-center items-center w-full">
                <Link
                  href={"/profile/favorite"}
                  className="text-[11px] font-medium "
                >
                  My favorite items ♥︎
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 md:w-1/2">
          <ul className="flex flex-col gap-1">
            <li>
              <div className="collapse bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title flex justify-between">
                  <div className="flex gap-3 py-2.5">
                    <Image
                      src={passwordLock}
                      alt="creditCard icon"
                      width={12}
                      height={12}
                    />
                    <div>Change Password</div>
                  </div>

                  <Image
                    src={rightIcon}
                    alt="right icon"
                    width={12}
                    height={12}
                  />
                </div>
                <div className="collapse-content">
                  <Link href={"/profile/change-password"}>
                    <button className="btn btn-ghost btn-xs sm:btn-sm md:btn-md lg:btn-lg">
                      Change my password
                    </button>
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <div className="collapse bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title flex justify-between">
                  <div className="flex gap-3 py-2.5">
                    <Image
                      src={infoIcon}
                      alt="info-icon"
                      width={12}
                      height={12}
                    />
                    <div>Get Help</div>
                  </div>

                  <Image
                    src={rightIcon}
                    alt="right icon"
                    width={12}
                    height={12}
                  />
                </div>
                <div className="collapse-content">
                  <p>hello</p>
                </div>
              </div>
            </li>

            <li>
              <button className="collapse" onClick={handleLogout}>
                <input type="checkbox" />
                <div className="collapse-title flex justify-between items-center">
                  <div className="flex gap-3 py-2.5 justify-center items-center">
                    <Image
                      className="w-3 h-3"
                      src={exitIcon}
                      alt="left icon"
                      width={exitIcon.width}
                      height={exitIcon.height}
                    />
                    <div className="text-red-500">Log Out</div>
                  </div>

                  <Image
                    className="w-3 h-3"
                    src={redRightIcon}
                    alt="right icon"
                    width={redRightIcon.width}
                    height={redRightIcon.height}
                  />
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
