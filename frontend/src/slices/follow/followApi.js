import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const followUser = async (id) => {
  const response = await axiosInstance.get(`/follow/${id}`);
  return response.data;
};
