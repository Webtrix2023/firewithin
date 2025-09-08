import React, { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link } from "react-router-dom";
import Footer from './Footer';
import { API } from '../api/config';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const [focused, setFocused] = useState({
        name: false,
        email: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ simple validations
    const validate = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        // if (!formData.password) {
        //     newErrors.password = "Password is required";
        // } else if (formData.password.length < 6) {
        //     newErrors.password = "Password must be at least 6 characters";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        try {
            setLoading(true);
             formData.map((item)=>{
                console.log(item)
            })
            const res = await API.post("/registerCustomer", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, 
            });

           
            navigate("/ty"); 
        } catch (err) {
            setServerError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
                            Please<br /> enter your <br /> details to <br /> Register
                        </h2>
                    </div>

                    {/* Right Side Form */}
                    <div className="bg-white rounded-2xl shadow-lg w-full md:w-[40%]">
                        <div className="py-16 px-8 md:py-20 md:px-16">
                            <h2 className="text-center mb-0 font-inter font-bold text-[28px] tracking-wide uppercase">
                                THE FIRE WITHIN
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-2 p-6">

                                {/* Name */}
                                <div>
                                    <label className="block ml-12 text-sm font-normal font-inter text-slate-500 mb-2">
                                        Name <span className="text-red-500 text-2xl">*</span>
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <FiUser
                                            className={`text-2xl ${focused.name ? "text-blue-600" : "text-gray-400"}`}
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter Name"
                                            className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            onFocus={() => setFocused({ ...focused, name: true })}
                                            onBlur={() => setFocused({ ...focused, name: false })}
                                        />
                                    </div> {errors.name && <p className='text-slate-800'>Name is required</p>}

                                </div>

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
                                    {errors.email && <p className='text-slate-800'>Email is invalid</p>}
                                </div>

                                {/* Password */}
                                {/* <div>
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
                                    </div> {errors.email && <p className='text-slate-800'>Email is invalid</p>}

                                </div> */}



                                {/* Register Button */}
                                <div className="flex flex-row items-center  pt-4 space-x-3  ml-8">
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="bg-black text-white font-inter px-8 py-3 rounded-full hover:bg-gray-800 transition"
                                    >
                                        Register
                                    </button>

                                    {/* Forgot Password */}
                                    <Link

                                        to="/reset-password"
                                        className="text-md text-gray-500 hover:underline "
                                        state={{ page: "register" }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Login link */}
                                <p className="text-gray-500 text-sm mt-6 ml-8">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-blue-500 hover:underline">
                                        Click here to login
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

export default Register;
