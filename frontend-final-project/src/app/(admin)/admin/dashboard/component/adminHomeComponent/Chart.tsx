import React from "react";
import { MonthSalesType } from "../AdminHome";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Chart({
  monthSaleData,
}: {
  monthSaleData: MonthSalesType;
}) {
  const today = new Date().getDate();

  // รวมค่าราคาของ product ใน order ทั้งหมดให้เป็นค่าเดียว
  const monthSaleArr = monthSaleData.map((data) => ({
    createdAt: new Date(data.createdAt).getDate(),
    revenue: data.products.reduce((acc, cur) => acc + cur.product.price, 0),
  }));

  // สร้างตัวแปรเก็บ ค่ารวม revenue ที่อยู่ใน createdAt (วันที่) เดียวกัน
  const mergeItem: { createdAt: number; revenue: number }[] = [];

  // ลูปรอบ monthSaleArr เพื่อรวม  revenue ที่อยู่ใน createdAt (วันที่) เดียวกัน
  for (const item of monthSaleArr) {
    const find = mergeItem.find(
      (thisItem) => thisItem.createdAt === item.createdAt
    );

    if (find) {
      find.revenue += item.revenue;
    } else {
      mergeItem.push(item);
    }
  }

  // สร้าง revenue = 0 สำหรับวันไหนที่ไม่มี order เลย
  for (let i = 1; i <= today; i++) {
    const find = mergeItem.find((thisItem) => thisItem.createdAt === i);

    console.log(i, find);
    if (!find) {
      mergeItem.push({ createdAt: i, revenue: 0 });
    }
  }

  const data = {
    labels: Array.from({ length: today }, (_, index) => index + 1),
    datasets: [
      {
        label: "This month revenue",
        data: mergeItem
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((order) => order.revenue),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "rgb(1,2,3)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="sm:h-60">
      <Line data={data} options={options} />
    </div>
  );
}
