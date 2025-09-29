import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineUndo } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { BsFileEarmarkMusic } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
const Navbar2 = (params) => {
  const navigate = useNavigate()
  const location = useLocation();
  const [displayMenu, setDisplayMenu] = useState(false)
  // Check current path
  const isMusicPage = location.pathname === "/audio";
  const isTextPage = location.pathname === "/text" || "/text2";
  const CurrPage = location.pathname;
  const HomePage = "/hp";

  return (
    <nav className="w-full bg-white shadow">
      <div className="mx-auto flex flex-wrap items-center justify-between px-3 py-2.5 md:py-4 ">
        {/* Left: Title + Chapter */}
        <div className="leading-tight mb-2 md:mb-0 flex-1 min-w-[180px] md:pl-10">
          <h1 className="font-bold text-base sm:text-lg md:text-2xl lg:text-3xl text-black/90">
            THE FIRE WITHIN
          </h1>
          <p className="font-normal text-[11px] sm:text-xs md:text-base lg:text-lg text-black/90 max-w-[65vw] md:max-w-none truncate">
            {CurrPage !== HomePage ? `CHAPTER-${params.chapterNumber} ${params.chapterName}` : ""}
          </p>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 lg:gap-6 text-blue-500 relative">
          {isMusicPage ? (
            <button
              aria-label="Switch to Text"
              title="Read Text"
              className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
              onClick={() => navigate("/text2")}
            >
              <img
                className="read w-4 sm:w-5 md:w-6 lg:w-7"
                src="https://firewithin.coachgenie.in/images//sites/read-small.svg"
                alt="Read"
              />
            </button>
          ) : isTextPage ? (
            <button
              aria-label="Switch to Music"
              title="Listen"
              className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
              onClick={() => navigate("/audio")}
            > <img
                className="listen w-4 sm:w-5 md:w-6 lg:w-7"
                src="https://firewithin.coachgenie.in/images//sites/listen-i.svg"
                alt="Listen"
              />

            </button>
          ) : null}

          <button
            aria-label="Profile"
            title="Profile"
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
            onClick={() => setDisplayMenu(!displayMenu)}
          >
            <CgProfile className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />
          </button>

          <button
            aria-label="Undo"
            title="Undo"
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
            onClick={() => {
              if (CurrPage === HomePage) navigate(-1);
              else navigate("/hp");
            }}
          >
            <img
              className="w-4 sm:w-5 md:w-6 lg:w-7"
              src="https://firewithin.coachgenie.in/images//sites/back.svg"
              alt="Undo"
            />
          </button>


          {/* Dropdown Menu */}
          {displayMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-50">
              <button
                onClick={() => navigate("/update-password")}
                className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base"
              >
                My Account
              </button>
              <hr />
              <button className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>


  );
};

export default Navbar2;
