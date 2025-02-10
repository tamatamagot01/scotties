import { NextResponse } from "next/server";
import { get } from "../const";

export const GET = async () => {
  const res = await get("/asset", "", "", true);

  const response = await res.json();

  return new NextResponse(JSON.stringify(response), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
