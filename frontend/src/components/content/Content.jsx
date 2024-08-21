import Feed from "../feed/Feed";
import Search from "../feed/feedSearch/Search";

function Content() {
  return (
    <div className="flex flex-col md:flex-row min-h-[100%] md:border-l-[0.25rem] border-gray-600 h-full">
      <div className="md:w-[70%] w-full h-full">
        <Feed />
      </div>
      <div className="md:w-[30%] md:block hidden">
        <Search />
      </div>
    </div>
  );
}

export default Content;
