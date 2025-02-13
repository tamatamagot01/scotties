import { NextResponse } from "next/server";
import { get } from "../const";

export const GET = async () => {
  try {
    const res = await get("/backend/api/asset", "", "", true);

    const response = await res.json();

    return new NextResponse(JSON.stringify(response), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
