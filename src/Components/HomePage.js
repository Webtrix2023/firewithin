import React,{useState,useEffect} from "react";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg";
import Henry_mob from "../assets/henry_mobile.png";
import listen_img from "../assets/listen.png";
import read_img from "../assets/read.png";
import podcast_img from "../assets/podcast.svg";
import { useLanguage } from "../LanguageContext";
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
    <div className="min-h-screen flex flex-col text-white">
      {/* Navbar */}
      <Navbar2 />
   <div
        className="relative flex flex-col md:flex-row items-center md:items-center justify-center md:justify-end min-h-screen w-full px-6 md:px-16 py-12 bg-[#1e2c33] bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: isDesktop ? `url(${Henry})` : "none",
        }}
      >
  {/* Mobile Image (top center) */}
  <div className="block md:hidden mb-6">
    <img
      src={Henry_mob}
      alt={t("title")}
      className="w-[115px] mx-auto rounded-lg shadow-md object-cover"
    />
  </div>

  {/* Right side content */}
  <div className="relative text-center md:text-left text-white md:w-[45%] lg:w-[40%] flex flex-col justify-center z-10">
    <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-snug">{t("title")}</h2>

    <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">{t("description")}
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
        <p className="text-base sm:text-xl font-extralight mt-2">{t("listen")}</p>
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
        <p className="text-base sm:text-xl font-extralight mt-2">{t("read")}</p>
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
        <p className="text-base sm:text-xl font-extralight mt-2">{t("podcast")}</p>
      </div>
    </div>
  </div>
</div>
            {/* Main Div */}
        </div>
    );
};

export default HomePage;
