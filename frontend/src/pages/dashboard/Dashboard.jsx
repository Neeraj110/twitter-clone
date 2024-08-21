/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import PostCard from "../../components/PostCard/PostCard";
import { Route, Routes } from "react-router-dom";
import Content from "../../components/content/Content";
import MessageConatiner from "../../components/messages/receiveMsg/MessageConatiner";
import NotificationContianer from "../../components/notification/NotificationContianer";
import ProfileContainer from "../../components/profile/ProfileContainer";
import UserProfileContainer from "../../components/userProfile/UserProfileContainer";
import SinglePostContainer from "../../components/singlePost/SinglePostContainer";
import Search from "../../components/explore/Search";
import { getAllNotifications } from "../../slices/notification/notificationApi";
import {
  setNotifications,
  setUnreadCount,
} from "../../slices/notification/notificationSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const dispatch = useDispatch();

  const handleAddPostClick = () => {
    setShowPopup(true);
  };

  const handleSearchClick = () => {
    setShowSearchPopup(true);
  };

  const handleSearchClose = () => {
    setShowSearchPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await getAllNotifications();
        dispatch(setNotifications(data));
        const unread = data.filter(
          (notification) => notification.unread
        ).length;
        dispatch(setUnreadCount(unread));
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [dispatch, setNotifications, setUnreadCount]);

  return (
    <div className="flex flex-row h-full">
      <aside className=" md:w-[16%] h-full ">
        <Sidebar
          onAddPostClick={handleAddPostClick}
          onSearchClick={handleSearchClick}
          // unreadCount={}
        />
      </aside>
      <main className="w-[100%] md:w[84%] ">
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="message" element={<MessageConatiner />} />
          <Route path="notifications" element={<NotificationContianer />} />
          <Route path="profile" element={<ProfileContainer />} />
          <Route path="profile/:id" element={<UserProfileContainer />} />
          <Route path="post/:postId" element={<SinglePostContainer />} />
        </Routes>
      </main>
      {showSearchPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Search show={showSearchPopup} onClose={handleSearchClose} />
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PostCard show={showPopup} onClose={handleClosePopup} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
