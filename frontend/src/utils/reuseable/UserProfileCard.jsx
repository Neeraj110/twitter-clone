/* eslint-disable react/prop-types */
import { MdDateRange } from "react-icons/md";
import { FaLink, FaBirthdayCake } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { formatDate } from "../../utils/getTime";

const UserProfileCard = ({
  user,
  isOwner,
  handleFollow,
  isFollowing,
  handleEdit,
  handleToggleFollowing,
  handleToggleFollowers,
}) => {
  return (
    <div className="text-white min-h-screen bg-black w-full border-gray-600">
      <div
        className={`relative border-b-[1.2px] border-gray-700 ${
          user?.coverImg ? "" : "bg-blue-500"
        }`}
      >
        <div
          className={`w-full h-[35vw] md:h-[11rem] overflow-hidden ${
            user?.coverImg ? "" : "bg-blue-500"
          }`}
        >
          {user?.coverImg ? (
            <img
              src={user.coverImg}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="absolute bottom-[-2.8rem] left-3 transform">
          <div className="relative w-[7.5rem] h-[7.5rem] md:w-32 md:h-32 lg:w-36 lg:h-36">
            <img
              src={
                user?.avatar ||
                `https://avatar.iran.liara.run/username?username=${user?.name}`
              }
              alt="Profile"
              className="w-full h-full rounded-full border-2 object-cover"
            />
          </div>
        </div>
      </div>
      <div className="pl-4 pr-4 pt-1 md:pt-2">
        <div className="flex justify-between items-center mt-12 sm:mt-16">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {user?.name}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              @{user?.username}
            </p>
          </div>
          {isOwner ? (
            <button
              onClick={handleEdit}
              className="text-black bg-white py-1 md:px-3 rounded-[100px] hover:bg-gray-600 px-2 md:text-[1rem] text-[.8rem]"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => handleFollow(user?._id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium ${
                isFollowing ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <p className="mt-4 text-sm md:text-base">
          {user?.description?.about || "Add about yourself"}
        </p>
        <hr className="mt-2 border-gray-600" />
        <div className="flex flex-col gap-4 mt-4 text-gray-400 text-sm md:text-base">
          <p className="flex items-center">
            <FaLocationDot className="inline-block mr-1" />
            {user?.description?.location || "No location added"}
          </p>
          <p className="flex items-center">
            <FaBirthdayCake className="inline-block mr-1" />
            {user?.description?.dob || "No date of birth added"}
          </p>
          <p className="flex items-center">
            <FaLink className="inline-block mr-1" />
            <a
              href={user?.description?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate"
            >
              {user?.description?.link || "No link added"}
            </a>
          </p>
        </div>
        <p className="flex items-center mt-3 text-sm md:text-base">
          <MdDateRange className="inline-block mr-1" />
          {user && formatDate(user.createdAt)}
        </p>
        <div className="flex gap-4 mt-4 text-sm md:text-base">
          <p
            onClick={() => handleToggleFollowing()}
            className="hover:underline cursor-pointer"
          >
            <span className="font-bold text-white cursor-pointer">
              {user?.following?.length}
            </span>{" "}
            Following
          </p>
          <p
            onClick={() => handleToggleFollowers()}
            className="hover:underline cursor-pointer"
          >
            <span className="font-bold text-white cursor-pointer">
              {user?.followers?.length}
            </span>{" "}
            Followers
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
