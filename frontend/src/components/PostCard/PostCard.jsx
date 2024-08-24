/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaImage, FaVideo } from "react-icons/fa6";
import { toast } from "react-toastify";
import { createPost, getAllPosts } from "../../slices/post/postApi";
import { useDispatch } from "react-redux";
import { setPosts } from "../../slices/post/postSlice";
import { setCredentials } from "../../slices/user/authSlice";
import { getMyProfile } from "../../slices/user/userApi";

const PostCard = ({ show, onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".popup-container")) {
          onClose();
          resetForm();
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  const resetForm = () => {
    setImageFile(null);
    setVideoFile(null);
    setPostContent("");
    setUploadProgress(0);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await getMyProfile();
      dispatch(setCredentials(data));
    } catch (error) {
      toast.error(error.data?.message || error.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", postContent);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (videoFile) {
        formData.append("video", videoFile);
      }
      await createPost(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });
      toast.success("Post created successfully");
      const { data } = await getAllPosts();
      dispatch(setPosts(data));
      onClose();
      resetForm();
      fetchProfile();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Post not created");
    } finally {
      setLoading(false);
    }
  };

  const handleClickClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-black text-white md:p-5 p-3 rounded-[20px]  md:w-[50%]  md:mx-4 w-[75%] popup-container relative shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-transform transform">
        <button
          onClick={handleClickClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 border-b-[1.2px]">
            <textarea
              className="w-full p-2 bg-black text-white rounded-md focus:outline-none"
              placeholder="What's happening?"
              rows="4"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4 flex flex-col gap-4 px-2 relative">
            <div className="flex flex-col gap-4">
              <label
                htmlFor="image-input"
                className="flex items-center space-x-2 cursor-pointer text-white hover:text-blue-500"
              >
                <FaImage className="text-xl" />
                {imageFile ? (
                  <span>{imageFile.name}</span>
                ) : (
                  <span>Select Image</span>
                )}
              </label>
              <input
                id="image-input"
                type="file"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <label
                htmlFor="video-input"
                className="flex items-center space-x-2 cursor-pointer text-white hover:text-blue-500"
              >
                <FaVideo className="text-xl" />
                {videoFile ? (
                  <span>{videoFile.name}</span>
                ) : (
                  <span>Select Video</span>
                )}
              </label>
              <input
                id="video-input"
                type="file"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </div>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            <button
              type="submit"
              className="px-5 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Creating..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
