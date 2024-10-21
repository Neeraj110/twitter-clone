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
          `/api/v1/messages/get-msg/${selectedConversation._id}`,
          {
            withCredentials: true, // Include this if needed
          }
        );

        // Assuming res.data.data contains the messages
        if (res.data && res.data.data) {
          dispatch(setMessages(res.data.data));
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          if (error.response.status === 401) {
            toast.error("Unauthorized access. Please log in.");
          } else {
            toast.error(
              `Error: ${error.response.data.message || error.message}`
            );
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("Network error. Please try again.");
        } else {
          // Something else happened
          toast.error(`Error: ${error.message}`);
        }
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
