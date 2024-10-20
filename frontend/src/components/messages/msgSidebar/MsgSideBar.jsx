/* eslint-disable react/prop-types */
import { useState } from "react";
import UserList from "./UserList";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "../../../slices/coversation/conversationSlice";
import { getUserInfo } from "../../../slices/coversation/messageApi/getUserInfo";
import { getRandomEmoji } from "../../../utils/emoji";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

function MsgSideBar({ onClose }) {
  const { conversations } = getUserInfo();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();


  
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationSelect = (conversation) => {
    dispatch(setSelectedConversation(conversation));
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground border-r border-gray-600 text-white overflow-auto">
      <div className="sticky flex  items-center gap-3 top-0 z-10 bg-background p-3">
        <input
          className="h-10 w-[80%] md:w-full rounded-md border border-gray-300 bg-background px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search users...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to={"/dashboard"}
          className="bg-white text-black px-4 py-2 rounded-full md:hidden block"
        >
          <FiArrowLeft size={20} />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {Array.isArray(filteredConversations) &&
        filteredConversations.length > 0 ? (
          filteredConversations.map((conversation, idx) => (
            <div
              key={conversation._id}
              onClick={() => handleConversationSelect(conversation)}
              className="cursor-pointer rounded-md p-2 transition duration-200 ease-in-out"
            >
              <UserList
                conversation={conversation}
                emoji={getRandomEmoji()}
                lastIdx={idx === filteredConversations.length - 1}
                onClose={onClose}
              />
            </div>
          ))
        ) : (
          <div className="text-white text-center">No conversations found</div>
        )}
      </div>
    </div>
  );
}

export default MsgSideBar;
