import React from "react";
import Navbar2 from "./Navbar2";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Navbar */}
      <Navbar2 />

      {/* Main Section */}
      <div
        className="relative flex flex-col md:flex-row items-center justify-center md:justify-end px-6 sm:px-8 md:px-12 py-12 w-full flex-1 bg-center bg-cover"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Henry.jpg)`,
        }}
      >
        {/* Text Section */}
        <div className="relative z-10 w-full md:w-[45%] bg-black/50 md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none text-center md:text-left mt-8 md:mt-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            The Fire Within
          </h2>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
            is an autobiography by industrialist Henry M. Rowan, chronicling his
            remarkable journey from a young engineer to the founder of
            Inductotherm Industries, Inc. The book traces his life from
            small-town America through World War II flight school and into his
            entrepreneurial endeavors. In 1953, Rowan started Inductotherm at
            his kitchen table, selling his house and risking everything to
            pursue his vision. His record-breaking $100 million gift to a small
            New Jersey college in 1992 brought him international attention, but
            it was just one chapter in a lifetime of bold decisions and personal
            resilience. <br /> <br /> The Fire Within is not only a tale of
            innovation and grit but also a quintessential American success
            story.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8">
            {/* LISTEN */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/book/listen")}
            >
              <img
                src={`${process.env.PUBLIC_URL}/Group1.png`}
                alt="Listen"
                className="w-20 sm:w-24 md:w-28"
              />
              <p className="text-lg sm:text-xl md:text-2xl font-extralight mt-2">
                LISTEN
              </p>
            </div>

            {/* READ */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/book/read")}
            >
              <img
                src={`${process.env.PUBLIC_URL}/Group 83.png`}
                alt="Read"
                className="w-20 sm:w-24 md:w-28"
              />
              <p className="text-lg sm:text-xl md:text-2xl font-extralight mt-2">
                READ
              </p>
            </div>

            {/* PODCAST */}
            <div
              className="flex flex-col items-center hover:cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/book/podcasts")}
            >
              <img
                src={`${process.env.PUBLIC_URL}/Group.svg`}
                alt="Podcast"
                className="w-20 sm:w-24 md:w-28 filter invert brightness-0"
              />
              <p className="text-lg sm:text-xl md:text-2xl font-extralight mt-2">
                PODCAST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
