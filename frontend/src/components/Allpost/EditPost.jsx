/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaTimes, FaImage, FaVideo } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllPosts, updatePost } from "../../slices/post/postApi";
import { useDispatch } from "react-redux";
import { setPosts } from "../../slices/post/postSlice";

function EditPost({ onClose, post }) {
  const [postContent, setPostContent] = useState(post?.content || "");

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.image) setImageFile({ name: post.image });
    if (post.video) setVideoFile({ name: post.video });
  }, [post]);

  const handleClickClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", postContent);
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }
      if (videoFile instanceof File) {
        formData.append("video", videoFile);
      }
      await updatePost(post._id, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });
      const { data } = await getAllPosts();
      dispatch(setPosts(data));
      setLoading(false);
      onClose();
      toast.success("Post updated successfully");
      // Clear form state or reset fields if needed
      setPostContent("");
      setImageFile(null);
      setVideoFile(null);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update post");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black text-white p-4 rounded-lg  w-full max-w-xs md:max-w-lg mx-4 relative overflow-auto shadow-[0_0_20px_rgba(255,255,255,0.6)]  transition-transform transform"
      >
        <button
          onClick={handleClickClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-white"
        >
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 border-b-[1.2px]">
            <textarea
              className="w-full p-2 bg-black text-white rounded-md focus:outline-none text-sm md:text-base"
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
                className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                  imageFile ? "text-blue-500" : "text-white"
                }`}
                aria-label="Upload image"
              >
                <FaImage className="text-xl md:text-2xl" />
                <span className="text-sm md:text-base">Select Image</span>
              </label>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <label
                htmlFor="video-input"
                className={`flex items-center gap-2 cursor-pointer hover:text-blue-500 ${
                  videoFile ? "text-blue-500" : "text-white"
                }`}
                aria-label="Upload video"
              >
                <FaVideo className="text-xl md:text-2xl" />
                <span className="text-sm md:text-base">Select Video</span>
              </label>
              <input
                id="video-input"
                type="file"
                accept="video/*"
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
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm md:text-base"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
