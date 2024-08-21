/* eslint-disable react/prop-types */
import Messages from "./Messages";
import SendMessage from "../sendMsg/SendMessage";
import { useSelector } from "react-redux";
import useGetMessages from "../../../slices/coversation/messageApi/getMessage";
import useListenMessages from "../../../slices/coversation/messageApi/useListenMessage";
import { useEffect, useRef } from "react";

const AllMessage = () => {
  const { messages, loading } = useGetMessages();

  useListenMessages();
  const lastMessageRef = useRef();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-[110vh]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-muted p-4 text-white">
        <div className="flex items-center gap-4">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
            <img
              className="aspect-square h-full w-full"
              alt="User Avatar"
              loading="lazy"
              src={
                selectedConversation?.avatar
                  ? selectedConversation?.avatar
                  : `https://eu.ui-avatars.com/api/?name=${selectedConversation?.name}`
              }
            />
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">
              {selectedConversation?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-auto p-3 sm:p-5">
        <div className="grid gap-4">
          {!loading &&
            selectedConversation &&
            Array.isArray(messages) &&
            messages.map((message) => (
              <div key={message._id} ref={lastMessageRef}>
                <Messages message={message} key={message._id} />
              </div>
            ))}

          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-400">
              Send a message to start the conversation
            </p>
          )}
        </div>
      </div>

      {/* Send Message Input */}
      <div className="sticky md:bottom-0  sm:bottom-0 bottom-10 z-10 bg-black  ">
        <SendMessage />
      </div>
    </div>
  );
};

export default AllMessage;
