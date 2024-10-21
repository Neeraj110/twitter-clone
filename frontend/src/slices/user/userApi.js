import axios from "axios";

const axiosInstance = axios.create({
  baseURL: ``,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Register
export const register = async (data) => {
  const response = await axios.post("/api/v1/auth/signup", data);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data) => {
  const response = await axiosInstance.post("/api/v1/auth/verify", data);
  return response.data;
};

// Login
export const login = async (data) => {
  const response = await axiosInstance.post("/api/v1/auth/login", data);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await axiosInstance.post("/api/v1/auth/logout");
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/forgot-password",
    data
  );
  return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/reset-password",
    data
  );
  return response.data;
};

// Delete User
export const deleteUser = async () => {
  const response = await axiosInstance.delete("/api/v1/auth/delete-user");
  return response.data;
};

// Delete User Avatar
export const deleteUserAvatar = async () => {
  const response = await axiosInstance.delete("/api/v1/auth/delete-avatar");
  return response.data;
};

// Update Profile
export const updateProfile = async (formData) => {
  const response = await axiosInstance.patch(
    "/api/v1/auth/update-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Update User Avatar
// export const updateUserAvatar = async (data) => {
//   const response = await axiosInstance.patch(
//     "/api/v1/auth/update-avatar",
//     data
//   );
//   return response.data;
// };

// // Update User Cover Image
// export const updateUserCoverImg = async (data) => {
//   const response = await axiosInstance.patch(
//     "/api/v1/auth/update-cover-img",
//     data
//   );
//   return response.data;
// };

// Get My Profile
export const getMyProfile = async () => {
  const response = await axiosInstance.get("/api/v1/auth/get-profile");
  sessionStorage.setItem("userInfo", JSON.stringify(response.data));
  return response.data;
};

// Get All Users
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/v1/auth/get-alluser");
  return response.data;
};

// Get My Posts
export const getMyPosts = async () => {
  const response = await axiosInstance.get("/api/v1/auth/me/post");
  return response.data;
};

// Get User Post
export const getUserPost = async (id) => {
  const response = await axiosInstance.get(`/api/v1/auth/post/${id}`);
  return response.data;
};

// Get User by Name
export const getUserByName = async (name) => {
  const response = await axiosInstance.get(`/api/v1/auth/find/${name}`);
  return response.data;
};

// Get All Search
export const getAllSearch = async (search) => {
  const response = await axiosInstance.get(
    `/api/v1/auth/search?name=${search}`
  );
  return response.data;
};

// Get User by ID
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/v1/auth/${id}`);
  return response.data;
};

// Get My Bookmarks
export const getMyBookmarks = async () => {
  const response = await axiosInstance.get("/api/v1/auth/me/bookmarks");
  return response.data;
};
