import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import podcast_img from "../assets/podcast-icon.svg";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { useLanguage } from "../LanguageContext"; // ✅ make sure this path matches your hook location

const Navbar2 = (params) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // ✅ useLanguage hook (replaces local state)
  const { t, lang, changeLanguage } = useLanguage();

  // Floating UI setup
  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // Page checks
  const CurrPage = location.pathname;
  const isMusicPage = CurrPage === "/book/listen";
  const isTextPage =
    CurrPage === "/book/read" || CurrPage === "/book/read-advanced";
  const HomePage = "/dashboard";

  // ✅ Global language change (no need to manage local state)
  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setShowLangMenu(false);
    localStorage.setItem("preferredLang", newLang);
  };

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-10">
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
              ? `${t("chapter")} - ${params?.chapterNumber ?? ""} ${params?.chapterName ?? ""}`
              : " "}
          </p>
        </div>

        {/* Right: Icons + Language */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 lg:gap-6 text-blue-500 relative">
          {/* Listen / Read Toggle */}
          {isMusicPage ? (
            <button
              aria-label="Switch to Text"
              title={t("Read")}
              className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
              onClick={() => navigate("/book/read")}
            >
              <img
                className="w-4 sm:w-5 md:w-6 lg:w-7"
                src={`${API_URL}/images/sites/read-small.svg`}
                alt={t("Read")}
              />
            </button>
          ) : isTextPage ? (
            <button
              aria-label="Switch to Music"
              title={t("LISTEN")}
              className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
              onClick={() => navigate("/book/listen")}
            >
              <img
                className="w-4 sm:w-5 md:w-6 lg:w-7"
                src={`${API_URL}/images/sites/listen-i.svg`}
                alt={t("LISTEN")}
              />
            </button>
          ) : null}

          {/* Podcast */}
          <button
            aria-label="Podcast"
            title={t("podcast")}
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
            onClick={() => navigate("/book/podcasts")}
          >
            <img
              className="w-4 sm:w-5 md:w-6 lg:w-7"
              src={podcast_img}
              alt={t("podcast")}
            />
          </button>

          {/* 🌐 Language Selector */}
          <button
            ref={refs.setReference}
            aria-label="Select Language"
            title={t("select_language")}
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
            onClick={() => setShowLangMenu((prev) => !prev)}
          >
            🌐
            <span className="ml-1 text-sm uppercase hidden sm:inline">{lang}</span>
          </button>

          {showLangMenu && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="bg-white border border-gray-200 rounded-md shadow-lg w-44 sm:w-48 z-50"
            >
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLanguageChange("ko")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Korean (한국인)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLanguageChange("zh")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Chinese (中国人)
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Profile */}
          <button
            aria-label="Profile"
            title={t("profile")}
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
            onClick={() => setDisplayMenu(!displayMenu)}
          >
            <CgProfile className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />
          </button>

          {/* Back */}
          <button
            aria-label="Back to dashboard"
            title={t("back_to_dashboard")}
            className="p-1.5 md:p-2 rounded-full hover:text-blue-700 transition-transform hover:scale-105"
            onClick={() => {
              if (CurrPage === HomePage) navigate(-1);
              else navigate("/dashboard");
            }}
          >
            <img
              className="w-4 sm:w-5 md:w-6 lg:w-7"
              src={`${API_URL}/images/sites/back.svg`}
              alt={t("back_to_dashboard")}
            />
          </button>

          {/* Profile Dropdown */}
          {displayMenu && (
            <div className="absolute right-0 top-full mt-4 w-36 sm:w-40 bg-white shadow-lg rounded-md flex flex-col z-50">
              <button
                onClick={() => navigate("/account")}
                className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base"
              >
                {t("my_account")}
              </button>
              <hr />
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-gray-500 text-sm sm:text-base"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
