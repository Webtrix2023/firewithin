import React from "react";
import Navbar2 from "./Navbar2";
import { FaHeadphones, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Player from "./Player";
const HomePage = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col text-white ">
            {/* Navbar */}
            <Navbar2 />

            {/* Main Div*/}
            <div
                className="relative flex  bg-cover flex-col md:flex-row items-center justify-end px-6 py-12 w-full flex-1"
                style={{
                    backgroundImage: `url("/Henry.jpg")`,
                }}
            >
                {/* Dark overlay for readability */}

                {/* Right - Text */}
                <div className="relative ml-40 md:w-1/3 mt-8 md:mt-0 md:pr-4 mr-40 flex flex-col z-10">
                    <h2 className="text-2xl font-bold mb-4">The Fire Within</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        is an autobiography by industrialist Henry M. Rowan, chronicling his remarkable journey from a young engineer
                        to the founder of Inductotherm Industries, Inc. The book traces his life from small-town America through World War II
                        flight school and into his entrepreneurial endeavors. In 1953, Rowan started Inductotherm at his kitchen table,
                        selling his house and risking everything to pursue his vision. His record-breaking $100 million gift to a small
                        New Jersey college in 1992 brought him international attention, but it was just one chapter in a lifetime of bold
                        decisions and personal resilience. The Fire Within is not only a tale of innovation and grit but also a
                        quintessential American success story.
                    </p>

                    {/* Buttons */}
                    <div className="flex">
                        <div className="flex flex-col items-center cursor-pointer justify-center absolute" onClick={() => navigate("/music")}>
                            <img src="/Group.png" className="bg-cover " />
                            <p className="text-2xl font-light absolute top-[148px] left-12 ">LISTEN</p>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer justify-center absolute left-40">
                            <img src="/Group 83.png" className="bg-cover " />
                             <p className="flex self-center text-2xl font-light  absolute top-[148px] left-14">READ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
