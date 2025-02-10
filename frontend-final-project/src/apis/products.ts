import axios from "axios";

type ProductFilter = {
  brand: string[];
  type: string[];
  gender: string[];
};

type ProductNameFilter = {
  nameFilter: string;
};

export const getProducts = async (path?: string, filter?: ProductFilter) => {
  const res = await axios.get(`/api/products/${path}`, {
    params: filter,
  });

  return res;
};

export const getProductInRange = async (page: Record<string, unknown>) => {
  const res = await axios.get(`/api/product-in-range`, {
    params: page,
  });

  return res;
};

export const getProductById = async (data: Record<string, unknown>) => {
  const res = await axios.get("/api/product-by-id", {
    params: data,
  });
  return res;
};

export const getProductByName = async (nameFilter: ProductNameFilter) => {
  const res = await axios.get("/api/product-by-name", {
    params: nameFilter,
  });
  return res;
};

export const getFiveMostViewProduct = async (
  category: Record<string, unknown>
) => {
  const res = await axios.get("/api/get-five-most-view-product", {
    params: category,
  });

  return res;
};

export const getTopSeller = async () => {
  const res = await axios.get("/api/get-top-seller");
  return res;
};

export const editProduct = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/edit-product", data);

  return res;
};

export const deleteProduct = async (data: Record<string, unknown>) => {
  const res = await axios.delete("/api/delete-product", {
    params: data,
  });
  return res;
};

export const incrementViewCount = async (data: Record<string, unknown>) => {
  const res = await axios.patch("/api/increment-view-count", data);
  return res;
};

export const sendReview = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/send-review", data);
  return res;
};

export const canReviewThisProduct = async (productId: string) => {
  const res = await axios.get(`/api/can-review?product_id=${productId}`);
  return res;
};

export const getAllReviewByProductId = async (productId: string) => {
  const res = await axios.get(
    `/api/get-all-review-by-product-id?product_id=${productId}`
  );
  return res;
};
