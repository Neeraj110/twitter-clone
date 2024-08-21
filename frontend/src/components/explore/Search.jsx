/* eslint-disable react/prop-types */

import SearchBox from "./SearchBox";
import { FaTimes } from "react-icons/fa";

const Search = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed  inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50"
      onClick={onClose}
    >
      <div
        className=" bg-black text-white p-5 rounded-[20px]  mx-4  relative min-h-[60%] min-w-[40%] shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-transform transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="mt-2 text-white p-2 rounded">
          <FaTimes />
        </button>
        <SearchBox onClose={onClose} />
      </div>
    </div>
  );
};

export default Search;
