import { NextRequest, NextResponse } from "next/server";
import { post } from "../const";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const res = await post("/backend/api/user/login", body);

    const data = await res.json();

    const response = new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const options: Record<string, unknown> = {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    };

    response.cookies.set("token", data.token, options);

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
