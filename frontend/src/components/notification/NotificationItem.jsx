/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  readNotification,
  deleteNotification,
} from "../../slices/notification/notificationApi";
import { toast } from "react-toastify";

function NotificationItem({ notification, fetchNotifications }) {
  const [loading, setLoading] = useState(false);

  const handleToggleRead = async (id) => {
    try {
      await readNotification(id);
      await fetchNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (id) => {
    setLoading(true);
    try {
      await deleteNotification(id);
      await fetchNotifications();
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b-2">
      <div
        className={`md:p-4 p-2 rounded-md mt-5 shadow-md ${
          notification?.unread ? "bg-black" : "bg-gray-700"
        } flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0`}
      >
        <div className="flex items-center w-full md:w-auto space-x-4">
          <img
            src={
              notification?.sender?.avatar
                ? notification?.sender?.avatar
                : `https://eu.ui-avatars.com/api/?name=${notification?.sender?.name}`
            }
            alt="Sender Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="md:text-lg font-semibold text-white">{notification?.tag}</p>
            <p className="text-gray-300">{notification?.message}</p>
            <p className="text-sm text-gray-400">
              {new Date(notification?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={() => handleToggleRead(notification?._id)}
            className={`px-3 py-1 rounded-md ${
              notification?.unread ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
            }`}
            disabled={loading}
          >
            {notification?.unread ? "Mark as Read" : "Read"}
          </button>
          <button
            onClick={() => handleDeleteNotification(notification?._id)}
            className="px-3 py-1 rounded-md bg-red-500 text-white"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-[2.1rem]"></div>
    </div>
  );
}

export default function NotificationList({ fetchNotifications }) {
  const [notifications, setNotifications] = useState([]);
  const notificationsFromStore = useSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    const loadNotifications = async () => {
      if (notificationsFromStore) {
        const sortedNotifications = [...notificationsFromStore].sort(
          (a, b) => b.unread - a.unread
        );
        setNotifications(sortedNotifications);
      }
    };

    loadNotifications();
  }, [notificationsFromStore]);

  return (
    <div className="p-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification?._id}
            notification={notification}
            fetchNotifications={fetchNotifications}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center">No notifications</p>
      )}
    </div>
  );
}
