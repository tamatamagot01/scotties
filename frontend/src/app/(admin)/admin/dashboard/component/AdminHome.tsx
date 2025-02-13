/* eslint-disable @next/next/no-img-element */
"use client";

import { useUserStore } from "@/store/zustand";
import todaySalesIcon from "@public/assets/icons/admin/todaySales.png";
import todayRevenueIcon from "@public/assets/icons/admin/todayRevenue.png";
import totalSalesIcon from "@public/assets/icons/admin/totalSales.png";
import totalRevenueIcon from "@public/assets/icons/admin/totalRevenue.png";
import Chart from "./adminHomeComponent/Chart";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopSeller } from "@/apis/products";
import {
  monthSaleOrders,
  todaySaleOrders,
  totalSaleOrders,
} from "@/apis/order";

type SalesType = {
  totalAmount: number;
  products: {
    product: {
      price: number;
    };
  }[];
}[];

const defaultValueSales = [
  {
    totalAmount: 0,
    products: [{ product: { price: 0 } }],
  },
];

export type MonthSalesType = {
  totalAmount: number;
  products: {
    product: {
      price: number;
    };
  }[];
  createdAt: Date;
}[];

const defaultValueMonthSales = [
  {
    totalAmount: 0,
    products: [{ product: { price: 0 } }],
    createdAt: new Date(),
  },
];

type NewsType = {
  author: string;
  title: string;
  url: string;
  urlToImage: string;
}[];

type TopSellerProductType = {
  imageUrl: string;
  productName: string;
  price: number;
  totalSales: number;
}[];

function AdminHome() {
  const { profileImage, firstName, roleId } = useUserStore();

  const [todaySales, setTodaySales] = useState<SalesType>(defaultValueSales);
  const [totalSales, setTotalSales] = useState<SalesType>(defaultValueSales);
  const [monthSales, setMonthSales] = useState<MonthSalesType>(
    defaultValueMonthSales
  );

  const [topSeller, setTopSeller] = useState<TopSellerProductType>([]);

  const [news, setNews] = useState<NewsType>();
  const [newsItem, setNewsItem] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          todaySaleRes,
          totalSaleRes,
          monthSaleRes,
          topSellerRes,
          newsRes,
        ] = await Promise.all([
          todaySaleOrders(),
          totalSaleOrders(),
          monthSaleOrders(),
          getTopSeller(),
          fetch(
            `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
          ),
        ]);

        setTodaySales(todaySaleRes.data);
        setTotalSales(totalSaleRes.data);
        setMonthSales(monthSaleRes.data);
        setTopSeller(topSellerRes.data);

        const newsData = await newsRes.json();

        setNews(newsData.articles);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  if (monthSales.length > 0) {
    console.log(monthSales[0]);
  }

  // คำนวน today sales & total sales
  const [todaySaleItems, setTodaySaleItems] = useState(0);
  const [todaySaleRevenue, setTodaySaleRevenue] = useState(0);
  const [totalSaleItems, setTotalSaleItems] = useState(0);
  const [totalSaleRevenue, setTotalSaleRevenue] = useState(0);
  const [monthSaleRevenue, setMonthSaleRevenue] = useState(0);

  useEffect(() => {
    const saleItemsToday = todaySales.reduce(
      (acc, cur) => acc + cur.totalAmount,
      0
    );
    const saleRevenueToday = todaySales.reduce(
      (acc, cur) =>
        acc + cur.products.reduce((acc, cur) => acc + cur.product.price, 0),
      0
    );

    const saleItemsTotal = totalSales.reduce(
      (acc, cur) => acc + cur.totalAmount,
      0
    );
    const saleRevenueTotal = totalSales.reduce(
      (acc, cur) =>
        acc + cur.products.reduce((acc, cur) => acc + cur.product.price, 0),
      0
    );

    const saleRevenueMonth = monthSales.reduce(
      (acc, cur) =>
        acc + cur.products.reduce((acc, cur) => acc + cur.product.price, 0),
      0
    );

    setTodaySaleItems(saleItemsToday);
    setTodaySaleRevenue(saleRevenueToday);
    setTotalSaleItems(saleItemsTotal);
    setTotalSaleRevenue(saleRevenueTotal);
    setMonthSaleRevenue(saleRevenueMonth);
  }, [todaySales, totalSales, monthSales]);

  return (
    <div className="w-full min-h-screen px-3 py-3 sm:px-5 sm:py-5">
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:h-40">
        <div className="flex flex-col sm:flex-row gap-2 sm:w-3/4">
          <div className="flex sm:flex-col justify-start items-center sm:items-start bg-indigo-200 shadow-md rounded-xl w-full h-28 sm:h-fit px-4 py-2 sm:py-4">
            <div className="bg-white flex justify-center items-center w-10 h-10 rounded-xl shadow-md">
              <Image
                className="w-6"
                src={todaySalesIcon}
                alt="icon"
                width={0}
                height={0}
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 ml-7 sm:ml-0 sm:mt-7">
              <div className="stat-title text-sm">Today Sale Items</div>
              <div className="flex items-center sm:items-start">
                <div className="stat-value text-2xl sm:text-3xl">
                  {todaySaleItems.toLocaleString("en-US")}
                </div>
                <div className="stat-title text-sm sm:stat-desc pl-1 sm:pl-0">
                  Items
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col justify-start items-center sm:items-start bg-indigo-200 shadow-md rounded-xl w-full h-28 sm:h-fit px-4 py-2 sm:py-4">
            <div className="bg-white flex justify-center items-center w-10 h-10 rounded-xl shadow-md">
              <Image
                className="w-6"
                src={todayRevenueIcon}
                alt="icon"
                width={0}
                height={0}
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 ml-7 sm:ml-0 sm:mt-7">
              <div className="stat-title text-sm">Today Revenue</div>
              <div className="flex items-center sm:items-start">
                <div className="stat-value text-2xl sm:text-3xl">
                  {todaySaleRevenue.toLocaleString("en-US")}
                </div>
                <div className="stat-title text-sm sm:stat-desc pl-1 sm:pl-0">
                  THB
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col justify-start items-center sm:items-start bg-indigo-200 shadow-md rounded-xl w-full h-28 sm:h-fit px-4 py-2 sm:py-4">
            <div className="bg-white flex justify-center items-center w-10 h-10 rounded-xl shadow-md">
              <Image
                className="w-6"
                src={totalSalesIcon}
                alt="icon"
                width={0}
                height={0}
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 ml-7 sm:ml-0 sm:mt-7">
              <div className="stat-title text-sm">Total Sale Items</div>
              <div className="flex items-center sm:items-start">
                <div className="stat-value text-2xl sm:text-3xl">
                  {totalSaleItems.toLocaleString("en-US")}
                </div>
                <div className="stat-title text-sm sm:stat-desc pl-1 sm:pl-0">
                  Items
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col justify-start items-center sm:items-start bg-indigo-200 shadow-md rounded-xl w-full h-28 sm:h-fit px-4 py-2 sm:py-4">
            <div className="bg-white flex justify-center items-center w-10 h-10 rounded-xl shadow-md">
              <Image
                className="w-6"
                src={totalRevenueIcon}
                alt="icon"
                width={0}
                height={0}
              />
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 ml-7 sm:ml-0 sm:mt-7">
              <div className="stat-title text-sm">Total Revenue</div>
              <div className="flex items-center sm:items-start">
                <div className="stat-value text-2xl sm:text-3xl">
                  {totalSaleRevenue.toLocaleString("en-US")}
                </div>
                <div className="stat-title text-sm sm:stat-desc pl-1 sm:pl-0">
                  THB
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500 text-white shadow-md rounded-xl h-28 sm:h-full sm:w-1/4 px-4 flex items-center">
          <img
            className="w-16 sm:w-24 rounded-full"
            src={profileImage}
            alt="admin-profile-image"
          />

          <div className="w-full text-center">
            <div className="w-full text-3xl font-extrabold">{firstName}</div>
            <div className="w-full underline">
              {roleId === 2 ? "Admin" : "Manager"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row mt-3">
        <div className="sm:w-3/4">
          <div>
            <div className="stat-title text-sm font-semibold">
              This month total sales
            </div>
            <div className="stat-value text-2xl sm:text-3xl">
              {monthSaleRevenue.toLocaleString("en-US")}
              <span className="stat-title text-sm sm:stat-desc pl-1 sm:pl-0">
                THB
              </span>
            </div>
          </div>
          <Chart monthSaleData={monthSales} />
        </div>

        {news && (
          <div className="sm:w-1/4 bg-indigo-200 shadow-md rounded-xl px-4 py-5 h-fit">
            <div className="flex justify-center">
              <img
                className="w-2/3"
                src={news[newsItem].urlToImage}
                alt="news-image"
              />
            </div>
            <div className="font-semibold opacity-50 mt-2">
              {news[newsItem].author}
            </div>
            <div className="text-sm">{news[newsItem].title}</div>

            <div className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <button
                  className="btn btn-xs"
                  onClick={() => setNewsItem((prev) => prev - 1)}
                  disabled={newsItem === 0}
                >{`<`}</button>
                <button
                  className="btn btn-xs"
                  onClick={() => setNewsItem((prev) => prev + 1)}
                  disabled={newsItem === news.length - 1}
                >{`>`}</button>
              </div>

              <Link
                href={news[newsItem].url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs"
              >
                Read news
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-col gap-4 mt-3 sm:w-[60%]">
        <div className="stat-value text-lg sm:text-xl">Top Seller</div>

        <div className="sm:text-sm sm:flex flex-col gap-3">
          {topSeller.map((item, index) => (
            <div
              key={index}
              className="sm:flex justify-between items-center bg-indigo-200 shadow-md rounded-xl sm:px-3 sm:py-2 w-full"
            >
              <div className="sm:flex items-center">
                <img
                  className="w-32  sm:w-12 sm:h-12 rounded-md"
                  src={item.imageUrl}
                  alt="product-image"
                />

                <div className="sm:w-44 sm:pl-4">
                  <div className="sm:font-semibold">
                    {item.productName.length > 20
                      ? item.productName.substring(0, 20)
                      : item.productName}
                  </div>
                  <div className="sm:stat-desc">Nike</div>
                </div>
              </div>

              <div className="sm:w-20">
                <div className="sm:font-semibold">Total Sales</div>
                <div>{item.totalSales}</div>
              </div>

              <div className="sm:w-20">
                <div className="sm:font-semibold">Price</div>
                <div>{item.price.toLocaleString("en-US")}</div>
              </div>

              <div className="sm:w-20">
                <div className="sm:font-semibold">Net Sales</div>
                <div>
                  {(item.totalSales * item.price).toLocaleString("en-US")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
