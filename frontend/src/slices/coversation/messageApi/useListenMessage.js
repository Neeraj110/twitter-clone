import { useEffect } from "react";
import { useSocketContext } from "../../../socketContext/SocketContext";
import { useSelector, useDispatch } from "react-redux";
import notificationSound from "../../../assets/sounds/notification.mp3";
import { setMessages } from "../conversationSlice";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket && selectedConversation) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.senderId === selectedConversation._id) {
          newMessage.shouldShake = true;
          const sound = new Audio(notificationSound);
          sound.play();
          dispatch(setMessages([...messages, newMessage]));
        }
      };
      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedConversation, dispatch, messages]);

 
};

export default useListenMessages;
