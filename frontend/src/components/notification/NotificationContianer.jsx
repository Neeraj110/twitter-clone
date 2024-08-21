/* eslint-disable react/prop-types */
import Notification from "./Notification";
import Alluser from "../alluser/Alluser";

function NotificationContainer() {
  return (
    <div className="text-white flex flex-col md:flex-row px-4 md:px-8 md:border-l-2 border-gray-600 bg-black h-full">
      {/* Notification section */}
      <div className="md:w-2/3 w-full h-full md:pr-4 bg-black ">
        <Notification />
      </div>
      {/* Alluser section */}
      <div className="md:w-1/3 hidden md:block border-l border-gray-600 h-full bg-black">
        <Alluser />
      </div>
    </div>
  );
}

export default NotificationContainer;
