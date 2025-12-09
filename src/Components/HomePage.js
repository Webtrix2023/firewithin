import React, { useState, useEffect } from "react";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg";
import Henry_mob from "../assets/Henry_Rowan_BGMobile.png";
import listen_img from "../assets/listen.png";
import read_img from "../assets/read.png";
import podcast_img from "../assets/podcast.svg";
import { useLanguage } from "../LanguageContext";
import BG from "../assets/BG.jpg";
 
const HomePage = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
 
  // 🔄 Update on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-col text-white">
      {/* Navbar */}
      <Navbar2 />
      <div
        className="
    relative flex flex-col md:flex-row
    items-center justify-center md:justify-end
    min-h-screen w-full
    px-6 md:px-16 py-12
    bg-cover bg-center bg-no-repeat
    transition-all duration-500
  "
        style={{
          backgroundImage: isDesktop ? `url(${Henry})` : `url(${BG})`,
        }}
      >
        {/* Mobile Image (top center) - Made larger */}
        <div className="relative block md:hidden w-full h-[55vh] sm:h-[60vh]">
          <img
            src={Henry_mob}
            alt={t("title")}
            className=" w-full h-full object-contain
      object-top
      md:object-cover
    "
          />
        </div>
 
        {/* Right side content */}
        <div
          //className="relative text-center md:text-left text-white md:w-[45%] lg:w-[40%] flex flex-col justify-center z-10  opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]"
          className="
  relative text-center md:text-left text-white md:w-[45%] lg:w-[40%]
  flex flex-col justify-center z-10 opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]
  mt-[-70px] sm:mt-[-80px] md:mt-0   /* shifts content UP only on mobile */
"
        >
          <h2 className="text-4xl font-light mb-4 leading-snug">
            {t("title")}
          </h2>
          <p className="text-gray-300 text-base text-justify sm:text-lg leading-relaxed mb-8">
            {t("description")}
          </p>
          {/* Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-10 sm:gap-14 text-center">
            {/* LISTEN */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 sm:w-24 md:w-28"
              onClick={() => navigate("/book/listen")}
            >
              <img
                src={listen_img}
                alt={t("listen")}
                className="object-contain w-14 sm:w-16 md:w-20 lg:w-24"
              />
              <p className="text-base sm:text-xl font-extralight mt-2">
                {t("listen")}
              </p>
            </div>
 
            {/* READ */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 sm:w-24 md:w-28"
              onClick={() => navigate("/book/read")}
            >
              <img
                src={read_img}
                alt={t("read")}
                className="object-contain w-14 sm:w-16 md:w-20 lg:w-24"
              />
              <p className="text-base sm:text-xl font-extralight mt-2">
                {t("read")}
              </p>
            </div>
 
            {/* PODCAST */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 sm:w-24 md:w-28"
              onClick={() => navigate("/book/podcasts")}
            >
              <img
                src={podcast_img}
                alt={t("podcast")}
                className="object-contain w-14 sm:w-16 md:w-20 lg:w-24 filter invert brightness-0"
              />
              <p className="text-base sm:text-xl font-extralight mt-2">
                {t("podcast")}
              </p>
            </div>
          </div>
          <div className="h-10 mb-8 block"></div>
        </div>
      </div>
      {/* Main Div */}
    </div>
  );
};
 
export default HomePage;