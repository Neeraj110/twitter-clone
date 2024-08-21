/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// for Sidebar to display user info
const getUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/users/info");
        const data = res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export { getUserInfo };
