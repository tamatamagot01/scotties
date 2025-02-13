import axios from "axios";

export const createPayment = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/create-payment", data);
  return res;
};

export const createPaymentNotLogin = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/create-payment-not-login", data);
  return res;
};

export const checkPaymentStatus = async (orderId: Record<string, string>) => {
  const res = await axios.get("/api/payment-status", {
    params: orderId,
  });
  return res;
};

export const successfulPayment = async (query: Record<string, unknown>) => {
  const res = await axios.get("/api/successful-payment", {
    params: query,
  });
  return res;
};

export const successfulPaymentNotLogin = async (
  query: Record<string, unknown>
) => {
  const res = await axios.get("/api/successful-payment-not-login", {
    params: query,
  });
  return res;
};
