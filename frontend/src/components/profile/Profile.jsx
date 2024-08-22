import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../../slices/user/userApi";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/user/authSlice";
import UserAllpost from "./UserAllpost";
import UserProfileCard from "../../utils/reuseable/UserProfileCard";
import EditProfile from "../editProfile/EditProfile";
import FollowingPopup from "./Popup/FollowPopup";
import { getAllNotifications } from "../../slices/notification/notificationApi";
import { Link } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("posts");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getMyProfile();
      dispatch(setCredentials(data));
      await getAllNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (userInfo) {
      setPosts(
        view === "posts" ? userInfo.posts || [] : userInfo.bookmarks || []
      );
    }
  }, [view, userInfo]);

  const handleToggle = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <div className="md:mb-4 mb-[4rem]">
      <UserProfileCard
        user={userInfo}
        isOwner={true}
        handleEdit={() => setShowEdit(true)}
        handleToggleFollowing={() => handleToggle(setShowFollowing)}
        handleToggleFollowers={() => handleToggle(setShowFollowers)}
      />
      <div className="mt-5 border-t border-gray-700 w-full ">
        <div className="flex justify-around text-white text-sm md:text-base">
          {["posts", "bookmarks"].map((viewType) => (
            <div
              key={viewType}
              onClick={() => setView(viewType)}
              className="py-3 text-center cursor-pointer text-gray-400 hover:underline"
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 w-full ">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  to={`/dashboard/post/${post?._id}`}
                  key={post._id}
                  className="mb-4 border-b-[1.3px] border-gray-600"
                >
                  <UserAllpost post={post} fetchProfile={fetchProfile} />
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">No posts to show</p>
            )}
          </>
        )}
      </div>
      {showFollowing && (
        <FollowingPopup
          onClose={() => setShowFollowing(false)}
          user={userInfo?.following}
          header="FollowingUsers"
        />
      )}
      {showFollowers && (
        <FollowingPopup
          onClose={() => setShowFollowers(false)}
          user={userInfo?.followers}
          header="Followers"
        />
      )}

      {showEdit && (
        <EditProfile
          show={showEdit}
          onClose={() => setShowEdit(false)}
          userInfo={userInfo}
          refetchProfile={fetchProfile}
        />
      )}
    </div>
  );
};

export default Profile;
