import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/config";
import { CgProfile } from "react-icons/cg";
import Navbar2 from "./Navbar2";

const Account = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    verify_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    let newErrors = {};

    if (!formData.old_password) newErrors.old_password = "Old password is required";

    if (!formData.new_password) {
      newErrors.new_password = "New password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.new_password)) {
      newErrors.new_password = "Password must include an uppercase letter";
    } else if (!/[0-9]/.test(formData.new_password)) {
      newErrors.new_password = "Password must include a number";
    } else if (!/[!@#$%^&*]/.test(formData.new_password)) {
      newErrors.new_password =
        "Password must include a special character (!@#$%^&*)";
    }

    if (!formData.verify_password) {
      newErrors.verify_password = "Please confirm your new password";
    } else if (formData.new_password !== formData.verify_password) {
      newErrors.verify_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg({ type: "", text: "" });

    if (!validate()) return;

    try {
      setLoading(true);
      const body = new URLSearchParams();
      body.append("old_password", formData.old_password);
      body.append("new_password", formData.new_password);
      body.append("confirm_password", formData.verify_password);

      const { data: res } = await API.post("/updateChangedPassword", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });

      if (res.flag === "S") {
        setServerMsg({ type: "success", text: "Password changed successfully!" });
        setFormData({ old_password: "", new_password: "", verify_password: "" });
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setServerMsg({ type: "error", text: res.msg });
      }
    } catch (err) {
      setServerMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar2></Navbar2>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full md:w-[40vw] bg-white rounded-2xl shadow-lg px-10 md:px-28 py-10 md:py-20">
          <h2 className="text-lg font-medium text-gray-500 mb-1">Welcome</h2>
          <h1 className="text-2xl font-normal text-blue-600 mb-12">Change Password</h1>

          {/* Server or success messages */}
          {serverMsg.text && (
            <div
              className={`mb-4 rounded-md px-3 py-2 text-sm ${
                serverMsg.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {serverMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                Old Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="old_password"
                placeholder="Enter Old Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.old_password}
                onChange={handleChange}
                required
              />
              {errors.old_password && (
                <p className="text-red-500 text-xs mt-1 ml-4">{errors.old_password}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.new_password}
                onChange={handleChange}
                required
              />
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1 ml-4">{errors.new_password}</p>
              )}
            </div>

            {/* Verify Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                Verify New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="verify_password"
                placeholder="Verify New Password"
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.verify_password}
                onChange={handleChange}
                required
              />
              {errors.verify_password && (
                <p className="text-red-500 text-xs mt-1 ml-4">{errors.verify_password}</p>
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

export default Account;
