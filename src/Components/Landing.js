import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import langv from "../assets/lang.png";

const Landing = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setShowLangMenu(false);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // Language floating menu — same as navbar
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  React.useEffect(() => {
    const handleClick = (e) => {
      if (
        showLangMenu &&
        !refs.reference.current?.contains(e.target) &&
        !refs.floating.current?.contains(e.target)
      ) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showLangMenu, refs]);

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    localStorage.setItem("preferredLang", newLang);
    setShowLangMenu(false);
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${Henry})` }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* === LANGUAGE SELECTOR TOP RIGHT === */}
      <div className="absolute top-4 right-6 z-50">
        <button
          ref={refs.setReference}
          onClick={() => setShowLangMenu((prev) => !prev)}
          className="p-2 pl-3 pr-3 rounded-full bg-white/90 shadow hover:scale-105 transition flex items-center gap-2"
        >
          {/* ICON */}
          <img src={langv} alt="language" className="w-6" />

          {/* LANG TEXT */}
          <span className="text-sm uppercase text-red-600 hidden sm:inline">
            {lang}
          </span>

          {/* ARROW AT RIGHT */}
          <svg
            className={`w-3 h-3 ml-auto transition-transform ${
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
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="bg-white border border-gray-200 rounded-md shadow-lg w-40 z-[9999]"
            >
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLanguageChange("ko")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Korean (한국인)
                  </button>
                </li>
              </ul>
            </div>
          </FloatingPortal>
        )}
      </div>
      {/* === Right side content === */}
      <div
        className="
  absolute inset-0 flex flex-col md:flex-row 
  items-center md:items-center justify-center md:justify-end
  px-6 md:px-16
"
      >
        <div
          className="relative text-center md:text-left text-white 
    md:w-[45%] lg:w-[40%] flex flex-col justify-center z-10"
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug opacity-0 translate-y-4 animate-[fadeUp_2s_ease-out_forwards] ">
            {t("title")}
          </h2>

          {/* Description */}
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-8 opacity-0 translate-y-4 animate-[fadeUp_2.5s_ease-out_forwards]">
            {t("description")}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={() => openModal("login")}
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition
              opacity-0 animate-[fadeIn_4s_ease-out_forwards]"
            >
              {t("login")}
            </button>

            <button
              onClick={() => openModal("register")}
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition
                opacity-0 animate-[fadeIn_5s_ease-out_forwards]"
            >
              {t("register_now")}
            </button>
          </div>
        </div>
      </div>

      {/* === Modal Popup === */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl w-11/12 max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              &times;
            </button>

            {modalType === "login" && (
              <Login
                openRegister={() => openModal("register")}
                openForgot={() => openModal("forgot")}
              />
            )}

            {modalType === "register" && (
              <Register
                openLogin={() => openModal("login")}
                openForgot={() => openModal("forgot")}
              />
            )}

            {modalType === "forgot" && (
              <ForgotPassword isModal openLogin={() => openModal("login")} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Landing;
