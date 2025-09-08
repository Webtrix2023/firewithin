import React, { useState } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import Footer from "./Footer";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const location = useLocation();
  const { page } = location.state || "";

  const [focused, setFocused] = useState({
    name: false,
    email: false,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add submit logic
  };

  return (
    <>
      {/* Main Section */}
      <section
        className="min-h-screen flex flex-col justify-between bg-center bg-cover"
        style={{ backgroundImage: "url('/Mask group.png')" }}
      >
        {/* Content */}
        <div className="flex flex-col md:flex-row items-center justify-around w-full flex-grow px-6 py-16">
          {/* Left Side Text (hidden on mobile) */}
          <div className="hidden md:flex items-center text-white">
            <h2 className="font-inter font-light text-[48px] md:text-[60px] lg:text-8xl md:leading-[125%] tracking-wide">
              Forgot<br /> password.
            </h2>
          </div>

          {/* Right Side Form (always visible, full width on mobile) */}
          <div className="bg-white rounded-2xl shadow-lg w-full md:w-[40%]">
            <div className="py-24 px-6 md:px-16">
              <h2 className="text-center mb-8 font-inter font-bold text-[28px] tracking-wide uppercase">
                THE FIRE WITHIN
              </h2>

              <form onSubmit={handleSubmit} className="space-y-2 w-full px-0 md:px-10">

                {/* Email */}
                <div>
                  <label className="block ml-12 text-sm font-normal font-inter text-gray-500 mb-2">
                    Email <span className="text-red-500 text-base">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiMail
                      className={`text-2xl ${focused.email ? "text-blue-600" : "text-gray-400"
                        }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      onFocus={() => setFocused({ ...focused, email: true })}
                      onBlur={() => setFocused({ ...focused, email: false })}
                    />
                  </div>
                </div>

                {/* Button */}
                <div className="flex pt-4 ml-8 justify-between">
                  <button
                    type="submit"
                    className="bg-black text-white font-inter px-8 py-3 rounded-full hover:bg-gray-800 transition"
                  >
                    VERIFY
                  </button>

                  {/* Home button (mobile only) */}
                  <p className="text-black font-inter px-8 py-3 rounded-full transition ">
                    <Link to={`/${page}`}>Back to {page}</Link>
                  </p>

                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </section>
    </>
  );
};

export default ForgotPassword;
