import React from 'react';
import { Link } from 'react-router-dom';
const Landing = () => {
    return (
        <section
            className="relative flex flex-1 flex-col justify-center items-start text-white px-8 h-[calc(100vh-64px)]"
            style={{
                backgroundImage: "url('/Mask group.png')",
                backgroundSize: 'cover',
                backgroundPosition: "center",
            }}
        >
            <div className="max-w-3xl md:ml-20 " >
                <h2 className="text-5xl md:text-8xl font-light mb-6 leading-tight">
                    Discover a<br />world of digital<br />content
                </h2>
                <button className="bg-white hover:text-blue-500 text-black md:px-8 px-5 md:py-4 py-2 rounded-full font-normal transition text-xl md:text-2xl md:mt-10">
                    <Link to="/register">
                    Register Now
                    </Link>
                    
                </button>
            </div>
        </section>
    );
};

export default Landing;
