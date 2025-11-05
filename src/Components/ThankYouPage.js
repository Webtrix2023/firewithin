import React from "react";
import {useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";

const ThankYouPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-[100svh] flex flex-col">
      {/* Navbar */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Main / background layers */}
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 hero-bg bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content centered */}
        <div
          className="
            relative z-10 text-white h-full overflow-y-auto
            px-6 md:px-10 py-8 md:py-12
            flex items-center justify-center
          "
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <div className="w-full max-w-5xl text-center">
            <h1 className="font-light leading-tight mb-4 text-3xl sm:text-5xl md:text-7xl">
              Thank you for registering!
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
              Please check your registered email for login credentials.<button onClick={()=>{navigate('/login');}}>Click here to login.</button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default ThankYouPage;
