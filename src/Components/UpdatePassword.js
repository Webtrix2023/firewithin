import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/config";
import { CgProfile } from "react-icons/cg";

export const UpdatePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // -------------------
  // VALIDATION FUNCTION
  // -------------------
  const validate = () => {
    let newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must include an uppercase letter";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must include a number";
    } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must include a special character (!@#$%^&*)";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  // -------------------
  // SUBMIT HANDLER
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return; // stop if invalid

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
      <nav className="px-6 md:px-10 py-8 shadow-sm flex justify-between items-center bg-white">
        <h1 className="font-bold text-base sm:text-lg md:text-3xl text-black/90">
          THE FIRE WITHIN
        </h1>
        <CgProfile className="text-xl md:text-3xl text-blue-500" />
      </nav>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full md:w-[40vw] bg-white rounded-2xl shadow-lg px-10 md:px-28 py-10 md:py-20">
          {/* Heading */}
          <h2 className="text-lg font-medium text-gray-500 mb-1">
            Welcome Landon Bill
          </h2>
          <h1 className="text-2xl font-normal text-blue-600 mb-12">
            Update password
          </h1>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                Old Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                Verify New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Verify New Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`my-4 bg-black text-white px-6 py-3 rounded-full transition ${
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
