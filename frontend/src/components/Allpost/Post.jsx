/* eslint-disable react/prop-types */
import { useState } from "react";
import Avatar from "../../utils/reuseable/Avatar.jsx";
import ContentSection from "../../utils/reuseable/ContentSection.jsx";
import MediaSection from "../../utils/reuseable/MediaSection.jsx";
import ActionButtons from "../../utils/reuseable/ActionButtons.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getBookmarkedPosts, likePost } from "../../slices/post/postApi.js";
import { getMyProfile } from "../../slices/user/userApi.js";
import { setCredentials } from "../../slices/user/authSlice.js";
import CommentSection from "./CommentSection.jsx";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu.jsx";
import { formatRelativeTime } from "../../utils/getTime.js";
import { HiDotsVertical } from "react-icons/hi";
import EditPost from "./EditPost.jsx";

const Post = ({ post, fetchPostsForYou }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  
  

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const postLike = async (id) => {
    try {
      await likePost(id);
      fetchPostsForYou();
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="bg-black p-4 shadow-md text-white flex flex-col gap-2 justify-center md:px-0 px-5 relative">
      <div className="mb-5 flex items-center justify-between">
        <Link to={`/dashboard/profile/${post?.owner?._id}`}>
          <Avatar
            avatar={post?.owner?.avatar}
            name={post?.owner?.name}
            username={post?.owner?.username}
          />
        </Link>
        <div className="relative">
          <p
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 flex items-center gap-3 cursor-pointer"
          >
            {formatRelativeTime(post?.createdAt)}
            <span>
              <HiDotsVertical />
            </span>
          </p>
          <DropdownMenu
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            postOwnerId={post?.owner?._id}
            currentUserId={userInfo?._id}
            postId={post._id}
            onEditPostClick={() => setShowEditPost(true)} // Pass the function to show edit post popup
          />
        </div>
      </div>
      <Link to={`/dashboard/post/${post?._id}`}>
        <ContentSection content={post.content} contentPreviewLimit={500} />
        <MediaSection image={post.image} video={post.video} />
      </Link>
      <ActionButtons
        isLikedByUser={post.likes.includes(userInfo?._id)}
        isBookmarkedByUser={userInfo?.bookmarks
          ?.map((bookmark) => bookmark._id)
          ?.includes(post._id)}
        onLike={() => postLike(post._id)}
        onComment={toggleComments}
        onBookmark={() => postBookmark(post._id)}
        likesCount={post.likes.length}
        commentsCount={post.comments.length}
      />
      {showComments && (
        <CommentSection
          currentPost={post}
          onClose={toggleComments}
          onCommentAdded={() => {}}
        />
      )}
      {showEditPost && (
        <EditPost post={post} onClose={() => setShowEditPost(false)} />
      )}
      <div className="mt-[2.5rem]"></div>
    </div>
  );
};

export default Post;
