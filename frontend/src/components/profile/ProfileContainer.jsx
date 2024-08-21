import Alluser from "../alluser/Alluser";
import Profile from "./Profile";

function ProfileContainer() {
  return (
    <div className="text-white flex min-h-[100%] ">
      <div className="md:w-[70%] w-[100%] h-[100%] bg-black border-l-[0.3vw] border-gray-600">
        <Profile />
      </div>
      <div className="md:w-[30%] hidden md:block border-l-[0.1vw] border-gray-600">
        <Alluser />
      </div>
    </div>
  );
}

export default ProfileContainer;
