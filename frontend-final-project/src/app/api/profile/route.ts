import { NextRequest, NextResponse } from "next/server";
import { get } from "../const";

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ error: "No token provided" }), {
      status: 401,
    });
  }

  const res = await get("/backend/api/member/profile", token, "", false);

  const response = await res.json();
  return new NextResponse(JSON.stringify(response), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
