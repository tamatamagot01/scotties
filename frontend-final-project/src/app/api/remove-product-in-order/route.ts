import { NextRequest, NextResponse } from "next/server";
import { del } from "../const";

export const DELETE = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    const res = await del("/backend/api/order/remove-order-item", "", params);

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
