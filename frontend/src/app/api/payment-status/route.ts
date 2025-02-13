import { NextRequest, NextResponse } from "next/server";
import { get } from "../const";

export const GET = async (req: NextRequest) => {
  const orderId = req.nextUrl.searchParams;

  const res = await get(
    "/backend/api/checkout/payment-status",
    "",
    orderId,
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
