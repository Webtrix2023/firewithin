import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg";
import Henry_mob from "../assets/Henry Rowan BG-01.png";
import BG from "../assets/BG.jpg";
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
import ThankYouPage from "./ThankYouPage";

const Landing = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // 🔄 Update on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  //overflow-hidden in line 301
  return (
    <div className={`flex flex-col ${
  isDesktop ? "overflow-hidden h-screen" : "overflow-auto"
}`}>
      <div
        className="
          relative flex flex-col md:flex-row 
          items-center justify-center md:justify-end
          min-h-screen w-full
          px-6 md:px-16 py-12
          bg-[#1e2c33] bg-cover bg-center
          transition-all duration-500
         
        "
        style={{
          backgroundImage: isDesktop ? `url(${Henry})` : `url(${BG})`,
        }}
      >
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
              className={`w-3 h-3 ml-auto transition-transform text-red-600 ${
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

        {/* Mobile Image (top center) */}
        <div className="block md:hidden mb-6 ">
          <img
            src={Henry_mob}
            alt={t("title")}
            className="w-[115px] mx-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Right side content */}
        <div className="relative text-center md:text-left text-white md:w-[45%] lg:w-[40%] flex flex-col justify-center z-10 opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]">
          <h2 className="text-4xl font-light mb-4 leading-snug">
            {t("title")}
          </h2>
          <p className="text-gray-300 text-base text-justify sm:text-lg leading-relaxed mb-8">
            {t("description")}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={() => openModal("login")}
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition"
            >
              {t("login")}
            </button>

            <button
              onClick={() => openModal("register")}
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
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
          // onClick={closeModal}
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
            {modalType === "thank-you" && (
              <ThankYouPage
                isModal
                openLogin={() => {
                  closeModal(); // Close the thank you modal
                  openModal("login"); // Open login modal
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
