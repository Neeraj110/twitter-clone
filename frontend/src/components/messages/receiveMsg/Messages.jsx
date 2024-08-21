/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/getTime";

function Messages({ message }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const [formattedTime, setFormattedTime] = useState("");
  const [fromMe, setFromMe] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [bubbleBgColor, setBubbleBgColor] = useState("");
  const [shakeClass, setShakeClass] = useState("");

  useEffect(() => {
    if (!message) return;

    // Update derived states
    const isFromMe = message.senderId === userInfo?._id;
    const pic = isFromMe
      ? userInfo.avatar ||
        `https://eu.ui-avatars.com/api/?name=${userInfo.name}`
      : selectedConversation?.avatar ||
        `https://eu.ui-avatars.com/api/?name=${selectedConversation?.name}`;

    setFromMe(isFromMe);
    setProfilePic(pic);
    setBubbleBgColor(isFromMe ? "bg-blue-500" : "");
    setShakeClass(message.shouldShake ? "shake" : "");
    setFormattedTime(extractTime(message.createdAt));
  }, [message, userInfo, selectedConversation]);

  if (!message) {
    return null;
  }

  return (
    <div className="">
      <div className={`chat ${fromMe ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full ">
            <img loading="lazy" alt="User Avatar" src={profilePic} />
          </div>
        </div>
        <div
          className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 `}
        >
          <p>{message.text}</p>
          {message.image && (
            <img
              src={message.image}
              alt="Message Attachment"
              className="my-2 rounded-lg max-w-full h-[10rem]"
            />
          )}
          {message.video && (
            <video
              controls
              src={message.video}
              className="my-2 rounded-lg max-w-full h-auto"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
      <br />
    </div>
  );
}

export default Messages;