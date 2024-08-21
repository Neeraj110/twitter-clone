import { useParams } from "react-router-dom";
import Search from "../feed/feedSearch/Search";
import SinglePost from "./SinglePost";

function SinglePostContainer() {
  const { postId } = useParams();
  return (
    <div className="flex flex-col md:flex-row h-screen border-l-[0.25rem] border-gray-600 bg-black min-h-[100vh]">
      <div className="flex-1 w-full h-full overflow-y-auto">
        <SinglePost postId={postId} />
      </div>
      <div className="md:w-[35%] w-full md:block hidden   border-gray-600">
        <Search />
      </div>
    </div>
  );
}

export default SinglePostContainer;
