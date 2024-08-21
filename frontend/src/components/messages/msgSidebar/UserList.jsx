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

//----------------------------------------------

{
  /* <div className="flex flex-col bg-background text-foreground border-r  text-white   h-[100vh] overflow-auto">
<div className="sticky top-0 z-10 bg-background  p-[0.9rem]">
  <input
    className="flex h-10 rounded-md border border-input bg-background px-4 py-2 text-sm text-black w-full"
    placeholder="Search messages..."
  />
</div>
<div className="flex-1 overflow-auto">
  <div className="space-y-2 p-4">
    {Array.isArray(users) &&
      users.map((user) => (
        <a
          key={user.id}
          href="#"
          className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-800 transition-colors "
        >
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 border">
            <img
              className="aspect-square h-full w-full"
              alt="Image"
              src={user.avatar}
            />
          </span>
          <div className="flex-1 truncate">
            <div className="font-medium">{user.name}</div>
            <p className="text-muted-foreground text-sm truncate">
              {user.lastMessage}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{user.time}</div>
        </a>
      ))}
  </div>
</div>
</div> */
}
