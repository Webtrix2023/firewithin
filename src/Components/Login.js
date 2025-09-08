import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from "react-router-dom";
import Footer from './Footer';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [focused, setFocused] = useState({
        email: false,
        password: false,
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
                    <div className="hidden md:flex items-center text-white ">
                        <h2 className="font-inter font-light text-[48px] md:text-[60px] lg:text-8xl md:leading-[125%] tracking-wide">
                            Please enter <br /> your details to <br /> login
                        </h2>
                    </div>

                    {/* Right Side Form */}
                    <div className="bg-white rounded-2xl shadow-lg w-full md:w-[40%]">
                        <div className="py-16 px-8 md:py-20 md:px-16">
                            <h2 className="text-center mb-0 font-inter font-bold text-[28px] tracking-wide uppercase">
                                THE FIRE WITHIN
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-2 p-6">

                                {/* Email */}
                                <div>
                                    <label className="block ml-12 text-sm font-normal font-inter text-slate-500 mb-2">
                                        Email <span className="text-red-500 text-2xl">*</span>
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <FiMail
                                            className={`text-2xl ${focused.email ? "text-blue-600" : "text-gray-400"}`}
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

                                {/* Password */}
                                <div>
                                    <label className="block ml-12 text-sm font-normal font-inter text-slate-500 mb-2">
                                        Password <span className="text-red-500 text-2xl">*</span>
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <FiLock
                                            className={`text-2xl ${focused.password ? "text-blue-600" : "text-gray-400"}`}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            onFocus={() => setFocused({ ...focused, password: true })}
                                            onBlur={() => setFocused({ ...focused, password: false })}
                                        />
                                    </div>
                                </div>

                                {/* Button + Forgot Password */}
                                <div className="flex flex-row items-center  pt-4 space-x-3  ml-8">
                                    <button
                                        type="submit"
                                        className="bg-black text-white font-inter px-8 py-3 rounded-full hover:bg-gray-800 transition"
                                       
                                    >
                                        LOGIN
                                    </button>

                                    {/* Forgot Password */}
                                    <Link
                                        to="/reset-password" state={{page:"login"}}
                                        className="text-md text-gray-500 hover:underline "
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Register link */}
                                <p className=" text-gray-500 text-sm mt-6 ml-8">
                                    Don’t have an account?{" "}
                                    <Link to="/register"  className="text-blue-500 hover:underline">
                                        Click here to register
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </section> 
        </>
    );
};

export default Login;
