/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { getAllUsers } from "../../slices/user/userApi";

function Alluser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="text-white min-h-screen md:h-full bg-black    border-muted pl-4 py-4">
      <h1 className="text-2xl font-bold mb-6">Make New Friends</h1>
      <div>
        {Array.isArray(users) &&
          users.map((user) => <UserCard key={user._id} user={user} />)}
      </div>
    </div>
  );
}

export default Alluser;
