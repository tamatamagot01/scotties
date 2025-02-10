/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { get } from "@/app/api/const";

export const GET = async (req: NextRequest) => {
  try {
    const res = await get(
      "/backend/api/product/product/get-brands",
      "",
      "",
      false
    );

    const response = await res.json();

    return new NextResponse(JSON.stringify(response), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};
