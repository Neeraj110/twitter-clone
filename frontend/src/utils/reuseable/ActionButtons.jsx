/* eslint-disable react/prop-types */

import { BiSolidLike } from "react-icons/bi";
import { TfiComments } from "react-icons/tfi";
import { FaBookmark } from "react-icons/fa";

const ActionButtons = ({
  isLikedByUser,
  isBookmarkedByUser,
  onLike,
  onComment,
  onBookmark,
  likesCount,
  commentsCount,
}) => (
  <div className="flex items-center justify-center gap-[5rem] text-gray-400 mt-5">
    <div
      onClick={onLike}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <BiSolidLike className={isLikedByUser ? "text-blue-500 text-xl" : "text-white text-xl"} />
      <span>{likesCount}</span>
    </div>
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={onComment}
    >
      <TfiComments className="text-white" />
      <span>{commentsCount}</span>
    </div>
    <div onClick={onBookmark} className="flex items-center space-x-2">
      <FaBookmark
        className={isBookmarkedByUser ? "text-green-600" : "text-white"}
      />
    </div>
  </div>
);

export default ActionButtons;
