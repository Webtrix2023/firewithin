import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from "../LanguageContext";

const Navbar = () => {
  const { t, lang, changeLanguage } = useLanguage();
  return (
    <nav className="w-full bg-white/95 shadow-sm">
      {/* full-width, comfy padding on desktop */}
      <div className="w-full px-4 md:px-10">
        {/* compact height on mobile, roomier on desktop via padding */}
        <div className="flex items-center justify-between py-3 md:py-5">
          <h1 className="font-semibold tracking-wide
                         text-base sm:text-lg md:text-2xl lg:text-3xl">
            THE FIRE WITHIN
          </h1>

          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-black text-white
                       px-4 py-2 md:px-6 md:py-3
                       text-sm md:text-lg
                       hover:bg-neutral-800 transition
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
