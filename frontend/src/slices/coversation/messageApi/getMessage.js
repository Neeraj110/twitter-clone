import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../conversationSlice";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();


  
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        if (!selectedConversation || !selectedConversation._id) {
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/messages/get-msg/${
            selectedConversation._id
          }`
        );

        dispatch(setMessages(res.data.data));
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation) {
      getMessages();
    }
  }, [selectedConversation, dispatch]);

  return { messages, loading };
};

export default useGetMessages;
