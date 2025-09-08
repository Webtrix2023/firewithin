import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineUndo } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
const Navbar2 = () => {
  return (
     <nav className="flex justify-between items-center text-black
      px-12 py-5 bg-white shadow">
      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold">THE FIRE WITHIN</h1>
        <p className="text-lg font-normal">CHAPTER-1 HOT METAL</p>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6 text-blue-500 text-2xl cursor-pointer">
        <FiFileText className="hover:text-blue-700 text-3xl font-s" title="Home" />
        <CgProfile className="hover:text-blue-700 text-3xl" title="Refresh" />
        <MdOutlineUndo className="hover:text-blue-700" title="Undo" />
      </div>
    </nav>
  );
};

export default Navbar2;
