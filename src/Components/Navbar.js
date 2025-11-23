import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import langv from "../assets/lang.png";
import { api } from "../api";

const Navbar = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    strategy: "fixed",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    localStorage.setItem("preferredLang", newLang);
    updateLanguage(newLang);
    setShowLangMenu(false);
  };

  const updateLanguage = async (newLang) => {
    try {
      const body = new URLSearchParams();
      body.append("lang", newLang);
      await api.post("/updateLanguage", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-white/95 shadow-sm z-40">
      <div className="w-full px-4 md:px-10">
        {/* Left: Title | Right: Actions (Lang + Login) */}
        <div className="flex items-center py-3 md:py-5">
          <h1 className="font-semibold tracking-wide text-base sm:text-lg md:text-2xl lg:text-3xl">
            {t("app_name")}
          </h1>

          {/* RIGHT ACTIONS — push to right on all screens */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Language */}
            <button
              ref={refs.setReference}
              aria-label="Select Language"
              aria-expanded={showLangMenu}
              aria-haspopup="menu"
              title={t("select_language")}
              className="p-1.5 md:p-2 rounded-full hover:text-red-700 transition-transform hover:scale-105"
              onClick={() => setShowLangMenu((prev) => !prev)}
            >
              <img
                className="w-5 sm:w-6 md:w-7 inline"
                src={langv}
                alt={t("lang")}
              />
              {/* keep code small on phones, show label from sm+ */}
              <span className="ml-1 text-sm sm:text-base uppercase text-red-600 hidden sm:inline">
                {lang}
              </span>
            </button>

            {/* Login */}
            {/* <Link
              to="/login"
              className="inline-flex items-center rounded-full bg-black text-white
                         px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3
                         text-xs sm:text-sm md:text-lg
                         hover:bg-neutral-800 transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              {t("login")}
            </Link> */}
          </div>
        </div>
      </div>

      {/* Portal menu so it never gets clipped; aligned to the button */}
      {showLangMenu && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            role="menu"
            className="bg-white border border-gray-200 rounded-md shadow-lg w-44 sm:w-48 z-[1000]"
          >
            <ul className="py-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                >
                  English
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLanguageChange("ko")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                >
                  Korean (한국인)
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => handleLanguageChange("zh")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                >
                  Chinese (中国人)
                </button>
              </li> */}
            </ul>
          </div>
        </FloatingPortal>
      )}
    </nav>
  );
};

export default Navbar;
