import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background (fills the section) */}
      <div className="absolute inset-0 hero-bg bg-cover bg-center" />
      {/* Subtle gradient overlay for legibility without making it “too black” */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent md:from-black/20 md:via-black/10" />

      {/* Content: subtract a compact header if you use one (h-12 mobile / h-14 desktop) */}
      <div
        className="
          relative text-white
          min-h-[calc(100svh-3rem)] md:min-h-[calc(100svh-3.5rem)]
          flex items-center
        "
      >
        <div className="w-full px-5 sm:px-8">
          <div className="max-w-[52rem] mx-auto md:mx-0 md:ml-20">
            <h2
                className="font-light leading-[1.08] mb-5 text-[clamp(3rem,7.2vw,6.25rem)]">
                <span className="md:block">Discover a </span>
                <span className="md:block">world of digital </span>
                <span className="md:block">content</span>
                </h2>

            <Link to="/signup" className="inline-block">
              <span
                className="
                  bg-white text-black rounded-full transition hover:bg-white/90
                  px-6 md:px-7 py-2.5 md:py-3
                  text-[clamp(1rem,2vw,1.1rem)]     /* modest size */
                "
              >
                Register Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
