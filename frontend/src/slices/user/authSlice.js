import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.userInfo = null;
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("posts");
    },
  },
});

export const { setCredentials, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
