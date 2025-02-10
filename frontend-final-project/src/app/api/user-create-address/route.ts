import { NextRequest, NextResponse } from "next/server";
import { post } from "../const";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    const res = await post("/backend/api/member/address", body, token);

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
