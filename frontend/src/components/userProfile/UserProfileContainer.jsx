import Alluser from "../alluser/Alluser";
import UserProfile from "./UserProfile.jsx";

function UserProfileContainer() {
  return (
    <div className="text-white flex min-h-[100%] ">
      <div className="md:w-[70%] w-[100%] border-gray-600 border-l-[0.3vw] h-[100%] bg-black">
        <UserProfile />
      </div>
      <div className="md:w-[30%] hidden md:block border-l-[0.1vw] border-gray-600">
        <Alluser />
      </div>
    </div>
  );
}

export default UserProfileContainer;
