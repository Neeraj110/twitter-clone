/* eslint-disable no-unused-vars */
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";


/* eslint-disable react/prop-types */
const FollowPopup = ({ onClose, user, header }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50"
      onClick={onClose}
    >
      <div
        className="bg-black text-white p-5 rounded-[20px] shadow-lg mx-4  relative min-h-[60%] md:min-w-[45%] min-w-[58%]  overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center pb-[1vw]">
          <h2 className="text-xl font-bold">{header}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white  p-3 rounded-full  transition-colors duration-200 ease-in-out"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        {Array.isArray(user) ? (
          user.map((u) => (
            <div key={u._id} className="flex items-center justify-between my-4">
              <Link to={`/dashboard/profile/${u._id}`}>
                <div className="flex items-center">
                  <img
                    src={
                      u.avatar
                        ? u.avatar
                        : `https://eu.ui-avatars.com/api/?name=${u.name}`
                    }
                    alt={`${u.name}'s avatar`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-sm text-gray-400">@{u.username}</p>
                  </div>
                </div>
              </Link>
              {/* Add any additional buttons or elements here if needed */}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No users to display</p>
        )}
      </div>
    </div>
  );
};

export default FollowPopup;
