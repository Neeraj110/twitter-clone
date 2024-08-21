/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { getAllSearch } from "../../../slices/user/userApi";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const Search = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setFilteredUsers([]);
        setNoResults(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await getAllSearch(searchTerm);
        if (data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Users not found");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchUsers(search);
    return fetchUsers.cancel;
  }, [search]);

  const handleNavigate = (id) => {
    navigate(`/dashboard/profile/${id}`);
    console.log(id);
  };

  return (
    <section className="px-3">
      <div className="flex items-center mt-4  rounded-md">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="flex-grow p-2 outline-none text-white rounded-l-md"
        />
        <button
          onClick={() => fetchUsers(search)}
          className="p-2 bg-gray-200 rounded-sm"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-black">Loading...</p>}
      <div>
        {filteredUsers.length > 0
          ? filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-2 border rounded-md mt-[1rem] cursor-pointer"
                onClick={() => handleNavigate(user._id)}
                // to={`/dashboard/profile/${user._id}`}
              >
                <p className="text-white">{user.name}</p>
                <p className="text-gray-400">@{user.username}</p>
              </div>
            ))
          : !loading &&
            noResults && <p className="text-gray-400">No results found</p>}
      </div>
    </section>
  );
};

export default Search;
