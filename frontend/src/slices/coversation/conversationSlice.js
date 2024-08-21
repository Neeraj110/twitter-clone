import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: sessionStorage.getItem("selectedConversation")
    ? JSON.parse(sessionStorage.getItem("selectedConversation"))
    : null,
  messages: sessionStorage.getItem("messages")
    ? JSON.parse(sessionStorage.getItem("messages"))
    : [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      sessionStorage.setItem(
        "selectedConversation",
        JSON.stringify(action.payload)
      );
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      sessionStorage.setItem("messages", JSON.stringify(action.payload));
    },
    clearMessages: (state) => {
      state.messages = [];
      sessionStorage.removeItem("messages");
    },
  },
});

export const { setSelectedConversation, setMessages, clearMessages } =
  conversationSlice.actions;

export default conversationSlice.reducer;
