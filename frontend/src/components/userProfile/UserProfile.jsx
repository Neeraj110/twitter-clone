import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getUserById,
  getUserPost,
  getMyProfile,
} from "../../slices/user/userApi";
import { followUser } from "../../slices/follow/followApi";
import { setCredentials } from "../../slices/user/authSlice";
import { toast } from "react-toastify";
import UserAllpost from "../profile/UserAllpost";
import UserProfileCard from "../../utils/reuseable/UserProfileCard";
import FollowingPopup from "./Popup/FollowPopup";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await getUserById(id);
      setUser(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [id]);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await getMyProfile();
      dispatch(setCredentials(data));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [dispatch]);

  const fetchUserPosts = useCallback(async () => {
    if (user?._id) {
      try {
        const { data } = await getUserPost(user._id);
        setPosts(data);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
    fetchProfile();
  }, [fetchUserProfile, fetchProfile]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleFollow = async (userId) => {
    try {
      const { message } = await followUser(userId);
      toast.success(message);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const isFollowing = userInfo?.following?.some((u) => u._id === user?._id);

  const handleToggle = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <div className="">
      <UserProfileCard
        user={user}
        isOwner={userInfo?._id === user?._id}
        handleFollow={handleFollow}
        isFollowing={isFollowing}
        handleToggleFollowing={() => handleToggle(setShowFollowing)}
        handleToggleFollowers={() => handleToggle(setShowFollowers)}
      />
      <div className="mt-8   w-full  h-[100%] px-2">
        <div className="py-3 text-[1.2rem] hover:underline text-center hover:text-gray-700 border-t-[1.1px] border-gray-500">
          Posts
        </div>
      </div>
      <div className="p-4 w-full max-w-auto">
        {Array.isArray(posts) && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <Link
                to={`/dashboard/post/${post._id}`}
                key={post._id}
                className="mb-4 "
              >
                <UserAllpost post={post} fetchProfile={fetchProfile} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No content to show</p>
        )}
      </div>
      {showFollowing && (
        <FollowingPopup
          onClose={() => setShowFollowing(false)}
          user={user?.following}
          header="FollowingUsers"
        />
      )}
      {showFollowers && (
        <FollowingPopup
          onClose={() => setShowFollowers(false)}
          user={user?.followers}
          header="Followers"
        />
      )}
    </div>
  );
};

export default UserProfile;
