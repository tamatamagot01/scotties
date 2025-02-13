import axios from "axios";

// post แนบ data ที่จะสร้างไปกับ body ได้
export const userCreateOrder = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/user-create-order", data);
  return res;
};

// get แนบ data ไปกับ body ไม่ได้ ต้องแนบ userId ไปกับ searchParams
export const getOrderByUserId = async (data: Record<string, unknown>) => {
  const res = await axios.get("/api/get-user-order", {
    params: data,
  });
  return res;
};

export const getOrderForUserNotLogin = async (data: { orders: string }) => {
  const res = await axios.get("/api/get-user-order-not-login", {
    params: data,
  });
  return res;
};

export const getOrderInRange = async (page: Record<string, unknown>) => {
  const res = await axios.get(`/api/order-in-range`, {
    params: page,
  });

  return res;
};

export const removeProductInOrder = async (data: Record<string, unknown>) => {
  const res = await axios.delete("/api/remove-product-in-order", {
    params: data,
  });
  return res;
};

export const getAllOrder = async (filter: Record<string, string>) => {
  const res = await axios.get("/api/get-orders", {
    params: filter,
  });
  return res;
};

export const getOrderByOrderIdAndOrderType = async (
  filter: Record<string, string>
) => {
  const res = await axios.get("/api/get-order-orderId-orderType", {
    params: filter,
  });
  return res;
};

export const findCoupon = async (couponCode: Record<string, unknown>) => {
  const res = await axios.get("/api/find-coupon", {
    params: couponCode,
  });
  return res;
};

export const todaySaleOrders = async () => {
  const res = await axios.get("/api/today-sales");
  return res;
};

export const totalSaleOrders = async () => {
  const res = await axios.get("/api/total-sales");
  return res;
};

export const monthSaleOrders = async () => {
  const res = await axios.get("/api/month-sales");
  return res;
};
