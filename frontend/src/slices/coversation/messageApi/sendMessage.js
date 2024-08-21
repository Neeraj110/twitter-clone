import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../conversationSlice";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();

  const sendMessage = async (text, imageFile, videoFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (videoFile) {
        formData.append("video", videoFile);
      }
      const res = await axios.post(
        `/api/v1/messages/send/${selectedConversation._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data.data;

      // if (Array.isArray(messages)) {
      dispatch(setMessages([...messages, data]));
      // } else {
      //   dispatch(setMessages([data]));
      // }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export { useSendMessage };
