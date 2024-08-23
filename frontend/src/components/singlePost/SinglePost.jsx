/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ContentSection from "../../utils/reuseable/ContentSection";
import MediaSection from "../../utils/reuseable/MediaSection";
import ActionButtons from "../../utils/reuseable/ActionButtons";
import Avatar from "../../utils/reuseable/Avatar";
import { useCallback, useEffect, useState } from "react";
import { getMyProfile } from "../../slices/user/userApi";
import {
  getBookmarkedPosts,
  likePost,
  getPost,
} from "../../slices/post/postApi";
import { setCredentials } from "../../slices/user/authSlice";
import { toast } from "react-toastify";
import EditPost from "../Allpost/EditPost";
import CommentSection from "../Allpost/CommentSection";
import { HiDotsVertical } from "react-icons/hi";
import DropdownMenu from "../Allpost/DropdownMenu";
import { formatRelativeTime } from "../../utils/getTime";

function SinglePost({ postId }) {
  const [currentPost, setCurrentPost] = useState(null);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchPost = useCallback(async (postId) => {
    try {
      setLoading(true);
      if (!postId) {
        throw new Error("Post ID is undefined");
      }
      const { data } = await getPost(postId);
      setCurrentPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPost(postId);
  }, [fetchPost, postId]);

  const postBookmark = async (id) => {
    try {
      await getBookmarkedPosts(id);
      const { data } = await getMyProfile();
      dispatch(setCredentials(data));
      toast.success("Post bookmarked successfully");
    } catch (error) {
      toast.error("Failed to bookmark post");
    }
  };

  const postLike = async (id) => {
    try {
      // Optimistically update the likes in the current post state
      setCurrentPost((prevPost) => {
        const isLikedByUser = prevPost.likes.includes(userInfo?._id);
        const updatedLikes = isLikedByUser
          ? prevPost.likes.filter((userId) => userId !== userInfo?._id)
          : [...prevPost.likes, userInfo?._id];
        return {
          ...prevPost,
          likes: updatedLikes,
        };
      });
      await likePost(id);
    } catch (error) {
      console.error("Failed to like post:", error);
      fetchPost(id);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentPost) {
    return <div>Post not found</div>;
  }

  const addCommentToPost = (newComment) => {
    fetchPost(postId);
    setCurrentPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment],
    }));
  };

  return (
    <div className="md:mb-4 mb-[4rem]">
      <div className="bg-black text-white  space-y-4 md:border-r-[1.1px] h-full border-gray-600">
        <div className="sticky top-0  p-2 shadow-md z-10 bg-black">
          <h1 className="text-center text-[1.8rem] border-b ">Post</h1>
        </div>
        <div className="mb-5 flex items-center justify-between px-[2vw]">
          <Link to={`/dashboard/profile/${currentPost?.owner?._id}`}>
            <Avatar
              avatar={currentPost?.owner?.avatar}
              name={currentPost?.owner?.name}
              username={currentPost?.owner?.username}
            />
          </Link>
          <div className="relative">
            <p
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 flex items-center gap-3 cursor-pointer"
            >
              {formatRelativeTime(currentPost?.createdAt)}
              <span>
                <HiDotsVertical />
              </span>
            </p>
            <DropdownMenu
              isOpen={showDropdown}
              onClose={() => setShowDropdown(false)}
              postOwnerId={currentPost?.owner?._id}
              currentUserId={userInfo?._id}
              postId={currentPost._id}
              onEditPostClick={() => setShowEditPost(true)}
            />
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 text-[1.1rem]">
          <ContentSection
            content={currentPost.content}
            contentPreviewLimit={500}
          />
          <div className="flex items-center justify-center">
            {(currentPost.image || currentPost.video) && (
              <MediaSection
                image={currentPost.image}
                video={currentPost.video}
              />
            )}
          </div>
        </div>
        <div className="">
          <ActionButtons
            isLikedByUser={currentPost.likes.includes(userInfo?._id)}
            isBookmarkedByUser={userInfo?.bookmarks
              ?.map((bookmark) => bookmark._id)
              ?.includes(currentPost._id)}
            onLike={() => postLike(currentPost._id)}
            onComment={toggleComments}
            onBookmark={() => postBookmark(currentPost._id)}
            likesCount={currentPost.likes.length}
            commentsCount={currentPost.comments.length}
          />
        </div>

        {/* Comments and Edit Sections */}
        {showComments && (
          <CommentSection
            currentPost={currentPost}
            onClose={toggleComments}
            onCommentAdded={addCommentToPost} // Add this line
          />
        )}
        {showEditPost && (
          <EditPost
            post={currentPost}
            onClose={() => setShowEditPost(false)}
          />
        )}
      </div>
    </div>
  );
}

export default SinglePost;
