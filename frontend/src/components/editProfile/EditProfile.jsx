/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
  const [avatar, setAvatar] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".popup-container")) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [show, onClose]);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);
      formData.append("dob", dob);
      formData.append("location", location);
      formData.append("link", link);
      if (avatar) formData.append("avatar", avatar);
      if (coverImg) formData.append("coverImg", coverImg);
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      refetchProfile();
      onClose();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || error.data);
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50  ">
      <div className="bg-black popup-container text-white md:p-4 rounded-[10px] shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-transform transform w-full max-w-lg   relative h-[80%] overflow-auto md:mx-0 mx-[2rem] p-4   ">
        <h2 className="md:text-xl font-bold mb-3">Edit Profile</h2>
        <button
          onClick={onClose}
          className="absolute md:top-4 md:right-4  text-white hover:text-gray-400 md:block top-4 right-4"
        >
          <FaTimes />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full md:p-2 p-1 rounded bg-black border text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="about">
              About
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full md:p-2 p-1 rounded bg-black border  text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="dob">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full md:p-2 p-1 rounded bg-black border  text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full md:p-2 p-1 rounded bg-black border text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="link">
              Link
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full md:p-2 p-1 rounded bg-black border text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="avatar">
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full md:p-2 p-1 rounded bg-black border text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-400 mb-1" htmlFor="coverImg">
              Cover Image
            </label>
            <input
              type="file"
              id="coverImg"
              accept="image/*"
              onChange={(e) => setCoverImg(e.target.files[0])}
              className="w-full md:p-2 p-1 rounded bg-black border text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white px-4 py-2 rounded text-sm font-medium text-black hover:bg-gray-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
