/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

export const post = async (
  url: string,
  body: Record<string, unknown>,
  token?: string
) => {
  let headers;

  if (token) {
    headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_DOMAIN}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return res;
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};

export const get = async (
  url: string,
  token: string | undefined,
  params: any,
  isCache: boolean
) => {
  try {
    const searchParams = params === "" ? "" : `?${params}`;

    const res = await fetch(
      `${process.env.BACKEND_DOMAIN}${url}${searchParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? token : "",
        },
        cache: isCache ? "default" : "no-cache",
      }
    );
    return res;
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};

export const patch = async (
  url: string,
  token: string,
  body: Record<string, unknown>
) => {
  try {
    const res = await fetch(`${process.env.BACKEND_DOMAIN}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    return res;
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};

export const del = async (url: string, token: string, params: any) => {
  let headers;
  if (token === "") {
    headers = {
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
  }

  try {
    const searchParams = params === "" ? "" : `?${params}`;

    const res = await fetch(
      `${process.env.BACKEND_DOMAIN}${url}${searchParams}`,
      {
        method: "DELETE",
        headers: headers,
      }
    );
    return res;
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};
