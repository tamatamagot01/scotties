import { NextRequest, NextResponse } from "next/server";
import { post } from "../const";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const res = await post("/backend/api/order/user-order", body);

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
