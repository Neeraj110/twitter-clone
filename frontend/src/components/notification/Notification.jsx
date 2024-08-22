import { useDispatch } from "react-redux";
import NotificationList from "./NotificationItem";
import { useCallback, useEffect } from "react";
import { getAllNotifications } from "../../slices/notification/notificationApi";
import {
  setNotifications,
  setUnreadCount,
} from "../../slices/notification/notificationSlice";
import { toast } from "react-toastify";

function Notification() {
  const dispatch = useDispatch();

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getAllNotifications();
      dispatch(setNotifications(data));
      const unread = data.filter((notification) => notification.unread).length;
      dispatch(setUnreadCount(unread));
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notifications");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="pr-4 md:pr-8 h-screen bg-black text-white">
      <div className="border-b border-gray-600 pb-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold mt-4">Notifications</h1>
      </div>

      <div className="overflow-y-auto  h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] scrollbar-none">
        <NotificationList fetchNotifications={fetchNotifications} />
      </div>
    </div>
  );
}

export default Notification;
