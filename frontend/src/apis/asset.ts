import axios from "axios";

export const getAsset = async () => {
  const res = await axios.get("/api/asset");
  return res;
};
