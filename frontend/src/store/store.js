import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/user/authSlice"; // Adjust the import paths if needed
import postSlice from "../slices/post/postSlice";
import notificationSlice from "../slices/notification/notificationSlice";
import conversationSlice from "../slices/coversation/conversationSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSlice,
    notifications: notificationSlice,
    conversation: conversationSlice,
  },
  devTools: true,
});

export default store;
