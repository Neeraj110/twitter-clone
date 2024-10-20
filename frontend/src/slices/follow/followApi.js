import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const followUser = async (id) => {
  const response = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}/api/v1/follow/${id}`
  );
  return response.data;
};
