/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { SiPostman } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../slices/user/userApi";
import { logoutSuccess } from "../../slices/user/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ onAddPostClick, onSearchClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { unreadCount } = useSelector((state) => state.notifications);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      dispatch(logoutSuccess());
      navigate("/login");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to logout:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="sidebar fixed h-full bg-black text-white  md:w-[14%] w-full  flex flex-col items-center md:py-4 md:px-[1rem] border-gray-800 ">
      <nav className="nav flex flex-col md:gap-5  md:mt-[2.2rem] mt-auto ">
        <div className="nav-item ">
          <Link
            to="/dashboard"
            className="flex items-center  space-x-2 hover:bg-white hover:text-black p-2 rounded-full"
          >
            <FaHome className="w-5 h-5" />
            <span className="hidden md:block">Home</span>
          </Link>
        </div>

        <div className="nav-item">
          <button
            onClick={onSearchClick}
            className="flex items-center  space-x-2 hover:bg-white hover:text-black p-2 rounded-full"
          >
            <FaSearch className="w-5 h-5" />
            <span className="hidden md:block">Search</span>
          </button>
        </div>

        <div className="nav-item">
          <Link
            to="/dashboard/notifications"
            className="flex items-center space-x-2 hover:bg-white hover:text-black p-2 rounded-full relative"
          >
            <FaBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-[-0.5rem] right-[-0.5rem]  w-5 h-5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
            <span className="hidden md:block">Notifications</span>
          </Link>
        </div>

        <div className="nav-item">
          <Link
            to="/dashboard/message"
            className="flex items-center space-x-2 hover:bg-white hover:text-black p-2 rounded-full"
          >
            <FaEnvelope className="w-5 h-5" />
            <span className="hidden md:block">Messages</span>
          </Link>
        </div>

        <div className="nav-item">
          <button
            onClick={onAddPostClick}
            className="flex items-center space-x-2 hover:bg-white hover:text-black p-2 rounded-full"
          >
            <SiPostman className="w-5 h-5" />
            <span className="hidden md:block">Add Post</span>
          </button>
        </div>

        <div className="nav-item">
          <Link
            to="/dashboard/profile"
            className="flex items-center space-x-2 hover:bg-white hover:text-black p-2 rounded-full"
          >
            <VscAccount className="w-5 h-5 text-[2rem]" />
            <span className="hidden md:block">Profile</span>
          </Link>
        </div>

        <div className="nav-item flex items-center space-x-2 hover:bg-white hover:text-black p-2 rounded-full">
          <FaSignOutAlt className="w-5 h-5" onClick={handleLogout} />
          <span onClick={handleLogout} className="md:block hidden">
            {isLoading ? "Logging out..." : "Logout"}
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
