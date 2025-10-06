import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineUndo } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { BsFileEarmarkMusic } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_URL } from "../config";
const Navbar2 = (params) => {
  const navigate = useNavigate()
  const location = useLocation();
  const [displayMenu, setDisplayMenu] = useState(false)
  // Check current path
  const isMusicPage = location.pathname === "/book/listen";
  const isTextPage = location.pathname === "/book/read" || "/book/read-advanced";
  const CurrPage = location.pathname;
  const HomePage = "/dashboard";

  const handleLogout = () => {
    // Remove all authentication-related data
    localStorage.removeItem("authid");
    localStorage.removeItem("customer_image");
    localStorage.removeItem("email");
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("name");

    // Optionally clear everything at once:
    // localStorage.clear();

    // Redirect to login page
    // window.location.href = "/login";
    // OR (if using useNavigate):
    navigate("/login", { replace: true });
  };

  return (
    <nav className="w-full bg-white shadow ">
      <div className="mx-auto flex flex-wrap items-center justify-between px-3 py-2.5 md:py-4 ">
        {/* Left: Title + Chapter */}
        <div className="leading-tight mb-2 md:mb-0 flex-1 min-w-[180px] md:pl-10">
          <h1 onClick={() => { navigate('/dashboard'); }} className="font-bold text-base sm:text-lg md:text-2xl lg:text-3xl text-black/90">
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
              onClick={() => navigate("/book/read")}
            >
              <img
                className="read w-4 sm:w-5 md:w-6 lg:w-7"
                src={`${APP_URL}/images//sites/read-small.svg`}
                alt="Read"
              />
            </button>
          ) : isTextPage ? (
            <button
              aria-label="Switch to Music"
              title="Listen"
              className="p-1.5 md:p-2 rounded-full hover:text-blue-700"
              onClick={() => navigate("/book/listen")}
            > <img
                className="listen w-4 sm:w-5 md:w-6 lg:w-7"
                src={`${APP_URL}/images//sites/listen-i.svg`}
                alt="Listen"
              />

            </button>
          ) : null}


          <img
            className="read w-4 sm:w-5 md:w-6 lg:w-7"
             src={`${process.env.PUBLIC_URL}/Vector.png`}
            alt="Read"
            onClick={()=>navigate("/book/podcasts")}
          />
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
              else navigate("/dashboard");
            }}
          >
            <img
              className="w-4 sm:w-5 md:w-6 lg:w-7"
              src={`${APP_URL}/images//sites/back.svg`}
              alt="Undo"
            />
          </button>


          {/* Dropdown Menu */}
          {displayMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-50">
              <button
                onClick={() => navigate("/reset-password")}
                className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base"
              >
                My Account
              </button>
              <hr />
              <button className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base" onClick={() => handleLogout()}>
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
