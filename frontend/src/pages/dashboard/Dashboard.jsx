import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllNotifications } from "../../slices/notification/notificationApi";
import {
  setNotifications,
  setUnreadCount,
} from "../../slices/notification/notificationSlice";

const Sidebar = lazy(() => import("../../components/sidebar/Sidebar"));
const PostCard = lazy(() => import("../../components/PostCard/PostCard"));
const Search = lazy(() => import("../../components/explore/Search"));
const MessageContainer = lazy(() =>
  import("../../components/messages/receiveMsg/MessageConatiner")
);
const NotificationContainer = lazy(() =>
  import("../../components/notification/NotificationContianer")
);
const ProfileContainer = lazy(() =>
  import("../../components/profile/ProfileContainer")
);
const UserProfileContainer = lazy(() =>
  import("../../components/userProfile/UserProfileContainer")
);
const SinglePostContainer = lazy(() =>
  import("../../components/singlePost/SinglePostContainer")
);
const Content = lazy(() => import("../../components/content/Content"));

function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const dispatch = useDispatch();

  // Memoized callback functions
  const handleAddPostClick = useCallback(() => setShowPopup(true), []);
  const handleSearchClick = useCallback(() => setShowSearchPopup(true), []);
  const handleSearchClose = useCallback(() => setShowSearchPopup(false), []);
  const handleClosePopup = useCallback(() => setShowPopup(false), []);

  // Fetch notifications effect
  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { data } = await getAllNotifications();
        if (!mounted) return;

        const notifications = data || [];
        dispatch(setNotifications(notifications));
        const unreadCount = notifications.filter((n) => n.unread).length;
        dispatch(setUnreadCount(unreadCount));
      } catch (error) {
        if (!mounted) return;
        console.error("Notification fetch error:", error);
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <aside className="md:w-1/6 h-full">
        <Suspense fallback={<div>Loading Sidebar...</div>}>
          <Sidebar
            onAddPostClick={handleAddPostClick}
            onSearchClick={handleSearchClick}
          />
        </Suspense>
      </aside>

      <main className="w-full md:w-5/6">
        <Suspense fallback={<div>Loading Content...</div>}>
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/message" element={<MessageContainer />} />
            <Route path="/notifications" element={<NotificationContainer />} />
            <Route path="/profile" element={<ProfileContainer />} />
            <Route path="/profile/:id" element={<UserProfileContainer />} />
            <Route path="/post/:postId" element={<SinglePostContainer />} />
          </Routes>
        </Suspense>
      </main>

      {showSearchPopup && (
        <Suspense fallback={<div>Loading Search...</div>}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Search show={showSearchPopup} onClose={handleSearchClose} />
          </div>
        </Suspense>
      )}

      {showPopup && (
        <Suspense fallback={<div>Loading Post...</div>}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <PostCard show={showPopup} onClose={handleClosePopup} />
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default Dashboard;
