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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // 🔄 Update on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col text-white">
      {/* Navbar */}
      <Navbar2 />
      <div
        className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-end min-h-screen w-full px-6 md:px-10 lg:px-16 py-8 md:py-10 lg:py-12 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: isDesktop ? `url(${Henry})` : `url(${BG})`,
        }}
      >
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
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12 lg:gap-14 text-center">
            {/* LISTEN */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 md:w-24 lg:w-28"
              onClick={() => navigate("/book/listen")}
            >
              <img
                src={listen_img}
                alt={t("listen")}
                className="object-contain w-14 md:w-18 lg:w-24"
              />
              <p className="text-base md:text-lg lg:text-xl font-extralight mt-2">
                {t("listen")}
              </p>
            </div>

            {/* READ */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 md:w-24 lg:w-28"
              onClick={() => navigate("/book/read")}
            >
              <img
                src={read_img}
                alt={t("read")}
                className="object-contain w-14 md:w-18 lg:w-24"
              />
              <p className="text-base md:text-lg lg:text-xl font-extralight mt-2">
                {t("read")}
              </p>
            </div>

            {/* PODCAST */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105 w-20 md:w-24 lg:w-28"
              onClick={() => navigate("/book/podcasts")}
            >
              <img
                src={podcast_img}
                alt={t("podcast")}
                className="object-contain w-14 md:w-18 lg:w-24 filter invert brightness-0"
              />
              <p className="text-base md:text-lg lg:text-xl font-extralight mt-2">
                {t("podcast")}
              </p>
            </div>
          </div>

          <div className="h-8 md:h-10 mb-6 md:mb-8 block"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
