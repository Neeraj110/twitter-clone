import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getAllNotifications = async () => {
  const response = await axiosInstance.get("/notification/all-notifications");
  sessionStorage.setItem("notifications", JSON.stringify(response.data));
  return response.data;
};

export const readNotification = async (id) => {
  const response = await axiosInstance.get(`/notification/read/${id}`);
  sessionStorage.setItem("unreadCount", JSON.stringify(response.data));
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notification/delete/${id}`);
  sessionStorage.setItem("notifications", JSON.stringify(response.data));
  return response.data;
};
