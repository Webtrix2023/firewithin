import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineUndo } from "react-icons/md";
import { FiFileText } from "react-icons/fi";

const Navbar2 = () => {
  return (
    <nav className="w-full bg-white shadow">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-3 md:px-12 py-2.5 md:py-5">
        {/* Left: Title + Chapter */}
        <div className="leading-tight">
          <h1 className="font-bold text-base sm:text-lg md:text-3xl">
            THE FIRE WITHIN
          </h1>
          <p className="font-normal text-[11px] sm:text-xs md:text-lg text-black/90 max-w-[65vw] md:max-w-none truncate">
            CHAPTER-1 HOT METAL
          </p>
        </div>

        {/* Right: Icons (smaller on mobile, same placement) */}
        <div className="flex items-center gap-3 md:gap-6 text-blue-500">
          <button
            aria-label="Home"
            title="Home"
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
          >
            <FiFileText className="text-xl md:text-3xl" />
          </button>
          <button
            aria-label="Profile"
            title="Profile"
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
          >
            <CgProfile className="text-xl md:text-3xl" />
          </button>
          <button
            aria-label="Undo"
            title="Undo"
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
          >
            <MdOutlineUndo className="text-xl md:text-3xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
