/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AllMessage from "./AllMessage";
import { TiMessages } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../../slices/coversation/conversationSlice";
import MsgSideBar from "../msgSidebar/MsgSideBar";
import { FaBars } from "react-icons/fa"; // Import hamburger icon

const MessageContainer = () => {
  const [showUserList, setShowUserList] = useState(false);
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(setSelectedConversation(null));
  }, [dispatch]);

  const handleShowUserList = () => {
    setShowUserList(!showUserList);
  };

  return (
    <div className="flex h-screen border-l md:border-l-4 border-gray-600 bg-black">
      <div className="md:hidden p-4 border-r border-gray-600">
        <FaBars
          className="text-white text-2xl cursor-pointer"
          onClick={handleShowUserList}
        />
      </div>

      {/* Sidebar with conditional rendering */}
      <div
        className={`${
          showUserList ? "block" : "hidden"
        } md:block w-[50%] sm:w-[50%] md:w-[13rem] border-l border-gray-600 bg-gray-800 md:bg-black z-50 absolute md:relative h-full transition-transform transform md:translate-x-0 ${
          showUserList ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MsgSideBar onClose={() => setShowUserList(false)} />
      </div>

      <div className="flex-1 flex flex-col bg-black">
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <div className="flex-1 overflow-y-auto h-[110vh]">
            <AllMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {userInfo.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
