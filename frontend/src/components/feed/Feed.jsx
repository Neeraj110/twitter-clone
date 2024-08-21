/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import Post from "../../components/Allpost/Post";
import { getAllPosts, getPostByFollowing } from "../../slices/post/postApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../slices/post/postSlice";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ForYou"); // New state to track active button
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  const fetchPostsFollowing = useCallback(async () => {
    setLoading(true);
    setActiveTab("Following"); // Set active tab to "Following"
    try {
      const { data } = await getPostByFollowing();
      dispatch(setPosts(data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchPostsForYou = useCallback(async () => {
    setLoading(true);
    setActiveTab("ForYou");
    try {
      const { data } = await getAllPosts();
      dispatch(setPosts(data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPostsForYou();
  }, [fetchPostsForYou]);

  return (
    <div className="min-h-screen border-r border-gray-700 flex flex-col w-full h-[100%]">
      <div className="flex text-white items-center md:justify-center md:gap-[10vw] w-full mt-4 border-b border-gray-700 justify-around">
        <button
          onClick={fetchPostsFollowing}
          className={`text-lg px-8 py-2  mb-2 transition-all duration-300 
            ${
              activeTab === "Following"
                ? "text-white border-b-2 border-blue-500 bg-opacity-50"
                : "text-white"
            } disabled:opacity-50`}
          disabled={loading}
        >
          Following
        </button>
        <button
          onClick={fetchPostsForYou}
          className={`text-lg px-8 py-2  mb-2 transition-all duration-300 
          ${
            activeTab === "ForYou"
              ? "text-white border-b-2 border-blue-500 bg-opacity-50"
              : "text-white "
          } disabled:opacity-50`}
          disabled={loading}
        >
          For you
        </button>
      </div>
      <div className="flex-grow md:w-[90%] mx-auto mt-8 overflow-y-auto">
        {Array.isArray(posts) &&
          posts.map((post) => (
            <div key={post._id} className="border-b-[1.2px] w-full">
              <Post post={post} fetchPostsForYou={fetchPostsForYou} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Feed;
