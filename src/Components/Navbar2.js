import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import { api } from "../api";
import podcast_img from "../assets/podcast.png";
import backRed from "../assets/backRed.png";
import ListenRed from "../assets/ListenRed.png";
import readRed from "../assets/readRed.png";
import langv from "../assets/lang.png";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import {
  Languages,
  FileHeadphone,
  BookCopy,
  Podcast,
  CircleUserRound,
  Undo2,
  BookOpenCheck,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import axios from "axios";

const Navbar2 = (params) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const {
  refs: profileRefs,
  floatingStyles: profileFloatingStyles,
  update: updateProfile,
} = useFloating({
  placement: "bottom-end",
  middleware: [offset(8), flip(), shift()],
});
  // Refs for click outside detection
  const profileMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  // ✅ useLanguage hook (replaces local state)
  const { t, lang, changeLanguage } = useLanguage();

  // Floating UI setup
  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
  });
  useEffect(() => {
  if (!profileRefs.reference.current || !profileRefs.floating.current) return;
  return autoUpdate(
    profileRefs.reference.current,
    profileRefs.floating.current,
    updateProfile
  );
}, [profileRefs.reference, profileRefs.floating, updateProfile]);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside profile menu
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setDisplayMenu(false);
      }
      // Check if click is outside language menu
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true }); // goes back to landing page
  };
  // Page checks
  const CurrPage = location.pathname;
  const isMusicPage = CurrPage === "/book/listen";
  //const isTextPage = CurrPage === "/book/read" || CurrPage === "/book/read-advanced";
  const isTextPage = CurrPage === "/book/read";
  const isPodcast = CurrPage === "/book/podcasts";
  const idDashboard = CurrPage === "/dashboard";
  const HomePage = "/dashboard";

  // ✅ Global language change (no need to manage local state)
  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setShowLangMenu(false);
    localStorage.setItem("preferredLang", newLang);
    updateLanguage(newLang);
  };

  const updateLanguage = async (newLang) => {
    try {
      //await axios.get(`${API_URL}updateLanguage/${newLang}`);
      const body = new URLSearchParams();
      body.append("lang", newLang);
      const res = await api.post("/updateLanguage", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        withCredentials: true,
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle language menu and close profile menu
  const toggleLangMenu = () => {
    setShowLangMenu((prev) => !prev);
    setDisplayMenu(false); // Close profile menu when opening language menu
  };

  // Toggle profile menu and close language menu
  const toggleProfileMenu = () => {
    setDisplayMenu((prev) => !prev);
    setShowLangMenu(false); // Close language menu when opening profile menu
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-300 to-white shadow sticky top-0">
      <div className="mx-auto flex flex-wrap items-center justify-between px-3 py-2.5 md:py-4">
        {/* Left: Title */}
        <div className="leading-tight mb-2 md:mb-0 flex-1 min-w-[180px] md:pl-10">
          <h1
            onClick={() => navigate("/dashboard")}
            className="font-bold cursor-pointer text-base sm:text-lg md:text-2xl lg:text-3xl text-black/90"
          >
            {t("app_name")}
          </h1>
          <p className="font-normal text-[11px] sm:text-xs md:text-base lg:text-lg text-black/90 max-w-[65vw] md:max-w-none truncate">
            {params?.chapterNumber
              ? `${t("chapter")} - ${params?.chapterNumber ?? ""} ${
                  params?.chapterName ?? ""
                }`
              : " "}
          </p>
        </div>
        {/* Right: Icons + Language */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 lg:gap-6 text-red-500 relative">
          {/* Listen / Read Toggle */}
          {!idDashboard && (<>
            <button
              aria-label="Switch to Text"
              title={t("read")}
              className="p-1.5 md:p-2 rounded-full transition-transform hover:scale-105"
              onClick={() => navigate("/book/read")}
            >
              {/* Book Icon in Red */}
              <BookOpenCheck
                className={`
                  w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
                  hover:text-red-800
                  ${isTextPage ? "text-red-800" : "text-stone-500"}
                `}
              />
            </button>
            <button
              aria-label="Switch to Music"
              title={t("listen")}
              className="p-1.5 md:p-2 rounded-full hover:text-red-700 transition-transform hover:scale-105"
              onClick={() => navigate("/book/listen")}
            >
              <FileHeadphone className={`
                  w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
                  hover:text-red-800
                  ${isMusicPage ? "text-red-800" : "text-stone-500"}
                `} />
            </button>
            <button
              aria-label="Podcast"
              title={t("podcast")}
              className="p-1.5 md:p-2 rounded-full hover:text-red-700 transition-transform hover:scale-105"
              onClick={() => navigate("/book/podcasts")}
            >
              <Podcast className={`
                  w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
                  hover:text-red-800
                  ${isPodcast ? "text-red-800" : "text-stone-500"}
                `} />
            </button>
            </>)}
          {/* Podcast */}
          {/* 🌐 Language Selector */}
          <div ref={langMenuRef} className="relative">
            <button
              ref={refs.setReference}
              aria-label="Select Language"
              title={t("select_language")}
              className="p-1.5 md:p-2 rounded-full hover:text-red-700 flex items-center gap-0 transition-transform hover:scale-105"
              onClick={toggleLangMenu}
            >
              <Languages className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
                 text-stone-500 hover:text-red-800 inline" />

              <span className="text-md text-stone-500 hover:text-red-800 uppercase hidden sm:inline ml-[3px]">
                {lang}
              </span>

              <svg
                className={`w-3 h-3 text-stone-500 hover:text-red-800 transition-transform ml-[2px] ${
                  showLangMenu ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showLangMenu && (
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                className="w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-[100] border border-gray-200"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageChange("ko")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                    >
                      Korean (한국인)
                    </button>
                  </li>
                  {/* <li>
                  <button
                    onClick={() => handleLanguageChange("zh")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                  >
                    Chinese (中国人)
                  </button>
                </li> */}
                </ul>
              </div>
            )}
          </div>

          {/* 👤 Profile */}
          <div ref={profileMenuRef} className="relative">
            {/* <button
              aria-label="Profile"
              title={t("profile")}
              className="p-1.5 md:p-2 rounded-full hover:text-red-700 flex items-center gap-1 transition-transform hover:scale-105"
              //onClick={() => setDisplayMenu(!displayMenu)}
              onClick={toggleProfileMenu}
            > */}
            <button
                ref={profileRefs.setReference}
                onClick={toggleProfileMenu}
                aria-label="Profile"
                title={t("profile")}
                className="p-1.5 md:p-2 pl-0 rounded-full hover:text-red-700 flex items-center gap-1 transition-transform hover:scale-105"
              >
              <CircleUserRound className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
                 text-stone-500 hover:text-red-800" />

              {/* ▼ Arrow */}
              <svg
                className={`w-3 h-3 text-stone-500 hover:text-red-800 transition-transform ${
                  displayMenu ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* {displayMenu && (
              <div className="absolute right-0 top-full mt-4 w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-100">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => navigate("/account")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                    >
                      {t("my_account")}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                    >
                      {t("logout")}
                    </button>
                  </li>
                </ul>
              </div>
            )} */}
            {displayMenu && (
  <div
    ref={profileRefs.setFloating}
    style={profileFloatingStyles}
    className="w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-[100] border border-gray-200"
  >
    <ul className="py-2 text-sm text-gray-700">
      <li>
        <button
          onClick={() => navigate("/account")}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
        >
          {t("my_account")}
        </button>
      </li>
      <li>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
        >
          {t("logout")}
        </button>
      </li>
    </ul>
  </div>
)}

          </div>

          {/* Back */}
          {!idDashboard && (<></>
            // <button
            //   aria-label="Back to dashboard"
            //   title={t("back_to_dashboard")}
            //   className="p-1.5 md:p-2 rounded-full hover:text-red-700 transition-transform hover:scale-105"
            //   onClick={() => {
            //     if (CurrPage === HomePage) navigate(-1);
            //     else navigate("/dashboard");
            //   }}
            // >
            //   {/* <img
            //     className="w-4 sm:w-5 md:w-6 lg:w-7"
            //     src={backRed}
            //     alt={t("back_to_dashboard")}
            //   /> */}
            //   <Undo2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-red-500" />
            // </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
