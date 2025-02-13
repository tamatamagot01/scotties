import { NextRequest, NextResponse } from "next/server";
import { get } from "../const";

export const GET = async (req: NextRequest) => {
  const res = await get(
    "/backend/api/product/product-by-id",
    "",
    req.nextUrl.searchParams,
    false
  );

  const response = await res.json();

  return new NextResponse(JSON.stringify(response), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
