import { NextRequest, NextResponse } from "next/server";
import { get } from "../const";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    const res = await get(
      "/backend/api/member/get-favorite-item",
      token,
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
