/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deletePost, getAllPosts } from "../../slices/post/postApi";
import { setPosts } from "../../slices/post/postSlice";
import { useDispatch } from "react-redux";

const DropdownMenu = ({
  isOpen,
  onClose,
  postOwnerId,
  currentUserId,
  postId,
  onEditPostClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleEditPost = () => {
    onEditPostClick();
    onClose();
  };

  const handleViewAllPosts = () => {
    navigate(`/dashboard/profile/${postOwnerId}`);
    onClose();
  };

  const handleDeletePost = async (Id) => {
    setLoaded(true);
    try {
      await deletePost(Id);
      toast.success("Post deleted successfully");
      const { data } = await getAllPosts();
      dispatch(setPosts(data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    } finally {
      setLoaded(false);
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`z-50 absolute right-0 mt-2 bg-black rounded-md shadow-[0_0_15px_rgba(255,255,255,0.6)] w-48 transition-transform transform ${
        isOpen ? "scale-100" : "scale-95 hidden"
      }`}
    >
      {postOwnerId === currentUserId ? (
        <div>
          <button
            onClick={handleEditPost}
            className="w-full px-5 py-2 hover:bg-gray-700 text-center border-b-[1px] border-gray-600"
          >
            Edit Post
          </button>
          <button
            onClick={() => handleDeletePost(postId)}
            className="w-full  px-5 py-2 hover:bg-red-500 text-center border-b-[1px] border-gray-600"
            disabled={loaded}
          >
            {loaded ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleViewAllPosts}
          className="w-full  px-5 py-2 hover:bg-gray-700 text-center border-b-[1px] border-gray-600"
        >
          View Profile
        </button>
      )}
      <button
        onClick={onClose}
        className="w-full  px-5 py-2 hover:bg-gray-700 text-center"
      >
        Close
      </button>
    </div>
  );
};

export default DropdownMenu;
