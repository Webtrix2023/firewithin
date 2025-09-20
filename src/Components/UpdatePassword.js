import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/config";
import { CgProfile } from "react-icons/cg";
import { FiLock } from "react-icons/fi";

export const UpdatePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [focused, setFocused] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        "/updatePassword",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/ty");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="px-6 md:px-12 py-8 shadow-sm flex justify-between items-center bg-white">
        <h1 className="font-bold text-base sm:text-lg md:text-3xl text-black/90">
          THE FIRE WITHIN
        </h1>
        <CgProfile className="text-xl md:text-3xl text-blue-500" />
      </nav>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full md:w-[40vw] bg-white rounded-2xl shadow-lg px-24 py-20">
          {/* Heading */}
          <h2 className="text-lg font-medium text-gray-500 mb-1">
            Welcome Landon Bill
          </h2>
          <h1 className="text-2xl font-normal text-blue-600 mb-16">
            Update password
          </h1>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
           <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-500 mb-1 ml-8 ">
                Old Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <FiLock
                  className={`text-xl ${
                    focused.confirmPassword ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Old Password"
                  className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused((p) => ({ ...p, confirmPassword: true }))
                  }
                  onBlur={() =>
                    setFocused((p) => ({ ...p, confirmPassword: false }))
                  }
                  required
                />
              </div>
            </div>

            {/* New Password */}
          <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-500 mb-1 ml-8 ">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <FiLock
                  className={`text-xl ${
                    focused.confirmPassword ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="New Password"
                  className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused((p) => ({ ...p, confirmPassword: true }))
                  }
                  onBlur={() =>
                    setFocused((p) => ({ ...p, confirmPassword: false }))
                  }
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-500 mb-1 ml-8 ">
                Verify New Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <FiLock
                  className={`text-xl ${
                    focused.confirmPassword ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Verify New Password"
                  className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused((p) => ({ ...p, confirmPassword: true }))
                  }
                  onBlur={() =>
                    setFocused((p) => ({ ...p, confirmPassword: false }))
                  }
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`ml-6 bg-black text-white px-6 py-3 rounded-full transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Updating…" : "UPDATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
