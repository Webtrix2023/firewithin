import React from "react";
import { useLanguage } from "../LanguageContext";

const Footer = () => {
  const { t, lang, changeLanguage } = useLanguage();
  return (
    <footer className="bg-black/80 text-white">
      {/* full-width; links start from the very left with page padding */}
      <div className="w-full px-4 md:px-10 py-2 md:py-3">
        <nav className="flex flex-wrap justify-start gap-x-4 gap-y-1
                        text-[11px] md:text-xs text-gray-300">
          <a href="#" className="hover:text-white hover:underline">{t("privacy_policy")}</a>
          <a href="#" className="hover:text-white hover:underline">{t("terms_service")}</a>
          <a href="#" className="hover:text-white hover:underline">{t("accessibility")}</a>
          <a href="#" className="hover:text-white hover:underline">{t("cookie_policy")}</a>
        </nav>

        <p className="text-[11px] md:text-xs text-gray-400 mt-1">
          {t("rights_reserved")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
