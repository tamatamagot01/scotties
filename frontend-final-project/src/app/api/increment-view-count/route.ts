import { NextRequest, NextResponse } from "next/server";
import { patch } from "../const";

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const res = await patch(
      "/backend/api/product/increment-view-count",
      "",
      body
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
