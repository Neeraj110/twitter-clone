/* eslint-disable react/prop-types */
// Avatar.jsx

import { getRandomEmoji } from "../emoji";

const Avatar = ({ avatar, name, username }) => (
  <div className="flex items-center">
    <img
      loading="lazy"
      src={avatar ? avatar : `https://eu.ui-avatars.com/api/?name=${name}`}
      className="w-10 h-10 rounded-full mr-3 border border-gray-600"
    />
    <div className="flex items-center md:gap-2">
      <p className="font-semibold flex items-center gap-4 hover:underline text-white text-[.8rem]">
        {name}
      </p>
      <span>{getRandomEmoji()}</span>
      <p className="text-gray-500 hover:underline text-[.8rem] ">@{username}</p>
    </div>
  </div>
);

export default Avatar;
