/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import ContentSection from "../../utils/reuseable/ContentSection";
import MediaSection from "../../utils/reuseable/MediaSection";
import Avatar from "../../utils/reuseable/Avatar";
import DropdownMenu from "../Allpost/DropdownMenu";
import EditPost from "../Allpost/EditPost";
import { formatRelativeTime } from "../../utils/getTime";
import { Link } from "react-router-dom";

const UserAllpost = ({ post, fetchProfile }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleEditPostClick = () => {
    setShowEditPost(true);
    setShowDropdown(false); // Close dropdown when editing
  };

  const handleEditPostClose = () => {
    setShowEditPost(false);
    fetchProfile(); // Refresh profile data after editing
  };

  return (
    <div className="bg-black p-4 shadow-md text-white flex flex-col gap-2 justify-center md:px-0 px-5 relative border-b-[1.5px] border-gray-600 mb-[1.2rem]">
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
            onClick={() => setShowDropdown((prev) => !prev)}
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
            onEditPostClick={handleEditPostClick} // Pass the function to show edit post popup
          />
        </div>
      </div>

      <ContentSection content={post.content} contentPreviewLimit={500} />
      <div className="flex justify-center">
        <MediaSection image={post.image} video={post.video} />
      </div>

      {showEditPost && <EditPost post={post} onClose={handleEditPostClose} />}
    </div>
  );
};

export default UserAllpost;
