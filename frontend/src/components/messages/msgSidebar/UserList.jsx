/* eslint-disable react/prop-types */

import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  setSelectedConversation,
} from "../../../slices/coversation/conversationSlice";
import { useSocketContext } from "../../../socketContext/SocketContext";

const UserList = ({ conversation, emoji, lastIdx, onClose }) => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);

  const isSelected = selectedConversation?._id === conversation?._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  const handleSelectConversation = () => {
    dispatch(setSelectedConversation(conversation));
    dispatch(clearMessages());
    onClose();
  };
  return (
    <div
      className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
      ${isSelected ? "bg-sky-500" : ""}`}
      onClick={() => dispatch(handleSelectConversation)}
    >
      <div
        className={`avatar ${isOnline ? "online" : ""} w-[2.1rem] h-[2.1rem]`}
      >
        <img
           loading="lazy"
          className="h-full w-full rounded-full"
          alt="Image"
          src={
            conversation.avatar
              ? conversation.avatar
              : `https://eu.ui-avatars.com/api/?name=${conversation.name}`
          }
        />
      </div>
      <div className="font-medium flex items-start">
        <p className="font-bold text-[.8rem] text-gray-200">
          {conversation.name}
        </p>
        <span className="text-[1rem]">{emoji}</span>

        {!lastIdx && <div className="divider my-0 py-0 h-1" />}
      </div>
    </div>
  );
};

export default UserList;

