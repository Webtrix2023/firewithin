import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
const ThankYouPage = () => {
    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="shrink-0">
                <Navbar />
            </div>
            <div className="flex flex-1 items-center text-white px-6 bg-cover bg-center" style={{ fontFamily: "Arial, sans-serif", backgroundImage: "url('/Mask group.png')" }}>
                <div className="w-[80%] md:ml-28">
                    <h1 className="text-4xl font-light md:text-9xl w-2/3 mb-4 ">
                        Thank you for registering!
                    </h1>
                    <p className="text-2xl md:text-6xl font-light w-full text-gray-200 leading-loose">
                        Please check your registered email for login credentials once you are approved
                    </p>
                </div>
            </div>
            <div className="shrink-0">
        <Footer />
      </div>
        </div>

    );
};

export default ThankYouPage;
