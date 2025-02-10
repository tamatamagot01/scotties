import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const res = new NextResponse(null, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.cookies.delete("token");
    return res;
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
