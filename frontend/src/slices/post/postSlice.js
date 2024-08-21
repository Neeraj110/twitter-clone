// postSlice.js

import { createSlice } from "@reduxjs/toolkit";

const POSTS_KEY = "posts"; // Key for sessionStorage

const getPostsFromSessionStorage = () => {
  const storedPosts = sessionStorage.getItem(POSTS_KEY);
  return storedPosts ? JSON.parse(storedPosts) : [];
};

// Initial state
const initialState = {
  posts: getPostsFromSessionStorage(), // Initialize with posts from sessionStorage
};

// Post slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      sessionStorage.setItem(POSTS_KEY, JSON.stringify(action.payload)); // Cache posts in sessionStorage
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
      sessionStorage.setItem(POSTS_KEY, JSON.stringify(state.posts));
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
        sessionStorage.setItem(POSTS_KEY, JSON.stringify(state.posts)); // Update cache
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      sessionStorage.setItem(POSTS_KEY, JSON.stringify(state.posts)); // Update cache
    },
  },
});

// Export actions
export const { setPosts, addPost, updatePost, deletePost } = postSlice.actions;

// Export the reducer
export default postSlice.reducer;
