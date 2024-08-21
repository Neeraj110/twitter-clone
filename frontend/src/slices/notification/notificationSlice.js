import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: sessionStorage.getItem("notifications")
    ? JSON.parse(sessionStorage.getItem("notifications"))
    : [],
  unreadCount: sessionStorage.getItem("unreadCount")
    ? JSON.parse(sessionStorage.getItem("unreadCount"))
    : 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      sessionStorage.setItem("notifications", JSON.stringify(action.payload));
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
      sessionStorage.setItem("unreadCount", JSON.stringify(action.payload));
    },
  },
});

export const { setNotifications, setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
