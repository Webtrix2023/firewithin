import React, { createContext, useState, useContext } from "react";
import translations from "./lang/i18n";
import translationsChapters from "./lang/i18n-chapters";
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const t = (key) => translations[lang][key] || key;
  
  const tc = (key) => translationsChapters[lang][key] || key;

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t ,tc}}>
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => useContext(LanguageContext);
