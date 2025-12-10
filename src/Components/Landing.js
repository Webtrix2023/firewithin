import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg";
import Henry_mob from "../assets/Henry_Rowan_BGMobile.png";
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
import { Languages } from "lucide-react";

const Landing = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // 🔄 Update on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
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

  // Language floating menu
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
    <div className="flex flex-col overflow-auto lg:overflow-hidden lg:h-screen">
      <div
        className="relative flex flex-col lg:flex-row items-center justify-normal lg:justify-end    
     w-full px-6 md:px-10 lg:px-16 py-8 md:py-10 lg:py-12 bg-[#1e2c33] bg-cover bg-center transition-all duration-500 min-h-screen overflow-y-auto"
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
            <Languages className="text-red-600 inline" size={18} />
            <span className="text-sm uppercase text-red-600 inline">
              {lang}
            </span>
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
                  <li>
                    <button
                      onClick={() => handleLanguageChange("tw")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Taiwan (대만)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageChange("jpn")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Japanese (日本語)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageChange("br")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Brazilian Portuguese (Português do Brasil)
                    </button>
                  </li>
                </ul>
              </div>
            </FloatingPortal>
          )}
        </div>

        {/* Mobile/Tablet Image (top center) */}
        <div className="relative block lg:hidden w-full h-[50vh] md:h-[55vh]">
          <img
            src={Henry_mob}
            alt={t("title")}
            className="w-full h-full object-contain object-top"
          />
        </div>

        {/* Right side content */}
        <div className="relative text-center lg:text-left text-white lg:w-[45%] xl:w-[40%] flex flex-col justify-center z-10 opacity-0 animate-[fadeUp_0.8s_ease-out_forwards] mt-[-60px] md:mt-[-40px] lg:mt-0">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-light mb-4 leading-snug">
            {t("title")}
          </h2>
          <p className="text-gray-300 text-sm md:text-base lg:text-lg text-justify leading-relaxed mb-6 md:mb-8">
            {t("description")}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center lg:justify-start">
            <button
              onClick={() => openModal("login")}
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition text-sm md:text-base"
            >
              {t("login")}
            </button>

            <button
              onClick={() => openModal("register")}
              className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition text-sm md:text-base"
            >
              {t("register_now")}
            </button>
          </div>

          <div className="h-8 md:h-10 mb-6 md:mb-8 block"></div>
        </div>
      </div>

      {/* === Modal Popup === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-xl w-11/12 max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-2xl"
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
                  closeModal();
                  openModal("login");
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
