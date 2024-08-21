/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateProfile } from "../../slices/user/userApi";

const EditProfile = ({ show, onClose, userInfo, refetchProfile }) => {
  const [about, setAbout] = useState(userInfo?.description?.about || "");
  const [dob, setDob] = useState(userInfo?.description?.dob || "");
  const [location, setLocation] = useState(
    userInfo?.description?.location || ""
  );
  const [link, setLink] = useState(userInfo?.description?.link || "");
  const [name, setName] = useState(userInfo?.name || "");

  useEffect(() => {
    if (show) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".popup-content")) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [show, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateProfile({ name, about, dob, location, link });
      toast.success("Profile updated successfully");
      refetchProfile();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || error.data);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-black text-white p-5 rounded-[20px] shadow-lg w-full max-w-lg mx-4 popup-content relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="about">
              About
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="dob">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="link">
              Link
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 rounded text-sm font-medium text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
