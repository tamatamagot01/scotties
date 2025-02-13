import { NextRequest, NextResponse } from "next/server";
import { get } from "../../const";

export const GET = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const category = pathname.split("/")[3];

  const res = await get(
    `/backend/api/product/${category}`,
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
