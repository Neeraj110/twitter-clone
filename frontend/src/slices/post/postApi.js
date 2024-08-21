import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const createPost = async (formData, config = {}) => {
  const response = await axiosInstance.post("/posts/create-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
  return response.data;
};

export const updatePost = async (id, formData, config = {}) => {
  const response = await axiosInstance.patch(
    `/posts/update-post/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    }
  );
  return response.data;
};


export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/posts/delete-post/${id}`);
  return response.data;
};

export const getBookmarkedPosts = async (id) => {
  const response = await axiosInstance.post(`/posts/bookmark/${id}`);
  return response.data;
};

export const getAllPosts = async () => {
  const response = await axiosInstance.get("/posts/get-allpost");
  return response.data;
};

export const getPost = async (id) => {
  const response = await axiosInstance.get(`/posts/get-post/${id}`);
  return response.data;
};

export const getPostByFollowing = async () => {
  const response = await axiosInstance.get("/posts/get-following-post");
  return response.data;
};

export const likePost = async (id) => {
  const response = await axiosInstance.patch(`/posts/like-post/${id}`);
  return response.data;
};

export const addComment = async (formData, id) => {
  const response = await axiosInstance.post(
    `/posts/add-comment/${id}`,
    formData
  );
  return response.data;
};

export const deleteComment = async (data) => {
  const response = await axiosInstance.delete(
    `/posts/delete-comment/${data.postId}/${data.commentId}`
  );
  return response.data;
};
