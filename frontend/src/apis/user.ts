import axios from "axios";

export const login = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/login", data);
  return res;
};

export const logout = async () => {
  const res = await axios.post("/api/logout");
  return res;
};

export const profile = async () => {
  const res = await axios.get("/api/profile");
  return res;
};

export const userRegister = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/register", data);
  return res;
};

export const userCreateAddress = async (data: Record<string, unknown>) => {
  const res = await axios.post("/api/user-create-address", data);
  return res;
};

export const getAddressByUserId = async () => {
  const res = await axios.get("/api/get-address-by-user-id");
  return res;
};

export const getUserByUserId = async (data: Record<string, number>) => {
  const res = await axios.get("/api/get-user-by-user-id", {
    params: data,
  });
  return res;
};

export const getUserInRange = async (page: Record<string, unknown>) => {
  const res = await axios.get(`/api/user-in-range`, {
    params: page,
  });

  return res;
};

export const editUserByAdmin = async (data: Record<string, unknown>) => {
  const res = await axios.patch("/api/edit-user-by-admin", data);
  return res;
};

export const editUserByUser = async (data: Record<string, unknown>) => {
  const res = await axios.patch("/api/edit-user-by-user", data);
  return res;
};

export const deleteUser = async (data: Record<string, unknown>) => {
  const res = await axios.delete("/api/delete-user", {
    params: data,
  });
  return res;
};

export const changePassword = async (data: Record<string, unknown>) => {
  const user = localStorage.getItem("user-store");
  const userEmail = JSON.parse(user as string).state.email;
  console.log(userEmail);

  // แนบ email ของ user ที่ดึงมาจาก localStorage ด้วย
  data.email = userEmail;

  const res = await axios.patch("/api/change-password", data);
  return res;
};

export const addFavoriteItem = async (data: Record<string, unknown>) => {
  const res = await axios.post(`/api/add-favorite-item`, data);
  return res;
};

export const getFavoriteItem = async (userId: number) => {
  const res = await axios.get(`/api/get-favorite-item?user_id=${userId}`);
  return res;
};

export const deleteFavoriteItem = async (productId: number) => {
  const res = await axios.delete(
    `/api/delete-favorite-item?product_id=${productId}`
  );
  return res;
};
