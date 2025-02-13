import { NextRequest, NextResponse } from "next/server";
import { get } from "../const";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    const res = await get(
      "/backend/api/product/review/get-review-by-product-id",
      "",
      params,
      false
    );

    const data = await res.json();

    const response = new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
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
