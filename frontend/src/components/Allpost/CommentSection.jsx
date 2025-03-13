/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { addComment, deleteComment } from "../../slices/post/postApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../slices/post/postSlice";
import { getAllPosts } from "../../slices/post/postApi";

const CommentSection = ({
  currentPost,
  onClose,
  onCommentAdded = onCommentAdded || (() => {}),
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const showComments = currentPost?.comments || [];
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = currentPost?._id;
      const formData = new FormData();
      formData.append("comment", comment);
      await addComment(formData, id);
      toast.success("Comment send successfully!");
      setComment("");
      fetchPostsForYou();
      onClose();
    } catch (error) {
      toast.error("Failed to add comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentDeleted = async (commentId, commentOwnerId) => {
    if (userInfo._id !== commentOwnerId) {
      toast.error("You can only delete your own comments.");
      return;
    }
    setLoading(true);
    try {
      await deleteComment({ postId: currentPost._id, commentId });
      toast.success("Comment deleted successfully");
      fetchPostsForYou();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsForYou = async () => {
    try {
      const { data } = await getAllPosts();
      dispatch(setPosts(data));
      onCommentAdded(showComments);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch posts");
    }
  };

  return (
    <div
      className="inset-0 fixed flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 w-full h-full mb-9"
      onClick={onClose}
    >
      <div
        className="bg-black text-white p-5 shadow-lg mx-4 
        md:w-[48%] w-[90%]
        relative  h-[80%] overflow-y-auto rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl"
        >
          <FaTimes />
        </button>
        <h3 className="text-xl mb-4 text-center font-bold">Comments</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="outline-none w-full p-2 bg-gray-900 rounded mb-4 text-sm md:text-base"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-white text-black px-3 py-1 rounded text-sm md:text-base ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="mt-4 mb-4">
          {Array.isArray(showComments) && showComments.length > 0 ? (
            showComments.map((comment) => (
              <div
                key={comment._id}
                className="my-5 border-b-[1px] border-gray-600 p-3"
              >
                <div className="flex items-center justify-between space-x-2 gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        comment?.user?.avatar
                          ? comment?.user?.avatar
                          : `https://eu.ui-avatars.com/api/?name=${comment?.user?.name}`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-gray-600 font-semibold text-sm md:text-base">
                      @{comment?.user?.username}
                    </p>
                  </div>
                  {userInfo._id === comment?.user?._id ? (
                    <button
                      disabled={loading}
                      onClick={() =>
                        commentDeleted(comment?._id, comment?.user?._id)
                      }
                      className={`bg-red-500 text-white cursor-pointer p-1 ${
                        loading ? "opacity-50" : ""
                      }`}
                    >
                      <FaTimes />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <p className="text-white mt-2 text-sm md:text-base">
                  {comment.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm md:text-base">
              No comments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
