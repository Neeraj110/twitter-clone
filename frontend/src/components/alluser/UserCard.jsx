/* eslint-disable react/prop-types */
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { followUser } from "../../slices/follow/followApi";
import { getMyProfile } from "../../slices/user/userApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/user/authSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Memoized fetchProfile function
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await getMyProfile();
      dispatch(setCredentials(data));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [dispatch]);

  // Handle follow/unfollow logic
  const handleFollow = async (userId) => {
    try {
      const { message } = await followUser(userId);
      toast.success(message);
      fetchProfile(); // Refresh user info after follow/unfollow
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const isFollowing = userInfo?.following?.some((u) => u._id === user?._id);

  return (
    <div className="flex items-center justify-between px-2 py-2 rounded-md mb-4 bg-black">
      <Link to={`/dashboard/profile/${user?._id}`}>
        <div className="flex items-center gap-3">
          <img
            loading="lazy"
            src={
              user.avatar
                ? user.avatar
                : `https://eu.ui-avatars.com/api/?name=${user.name}`
            }
            alt={`${user.name} avatar`}
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <p className="font-medium text-white">{user.name}</p>
        </div>
      </Link>
      {userInfo?._id !== user?._id && (
        <button
          onClick={() => handleFollow(user?._id)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            isFollowing ? "bg-black text-white border" : "bg-white text-black"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;
