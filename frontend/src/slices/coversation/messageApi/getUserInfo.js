/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Custom hook to fetch user info and conversations
const useGetUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/users/info`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const data = res.data;

        // Skip the array check temporarily to debug
        setConversations(data);
      } catch (error) {
        if (error.response) {
          toast.error(`Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
          toast.error("Network error. Please try again.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  // Dependency array: empty, so effect runs once on mount

  return { loading, conversations };
};

export default useGetUserInfo;
