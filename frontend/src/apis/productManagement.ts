import axios from "axios";

export const createProduct = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/admin/product/create", data);
  return res;
};

export const getAllBrand = async () => {
  const res = await axios.get("/api/admin/get-brands");
  return res;
};

export const getAllType = async () => {
  const res = await axios.get("/api/admin/get-types");
  return res;
};

export const getAllOptionNames = async (typeName: Record<string, unknown>) => {
  const res = await axios.get("/api/admin/get-option-names", {
    params: typeName,
  });
  return res;
};
