import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API } from "../api/config";
import { CgProfile } from "react-icons/cg";
import Navbar2 from "./Navbar2";
import { useLanguage } from "../LanguageContext";

export const UpdatePassword = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const vfcode = searchParams.get("vfcode");
  const customerID = searchParams.get("auth-id");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // -------------------
  // VALIDATION FUNCTION
  // -------------------
  const validate = () => {
    let newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = '${t("new_password_is_required")}';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '${t("Password_characters")}';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword =
        '${t("password_must_include_an_uppercase_letter")}';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = '${t("password_must_include_a_number")}';
    } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
      newErrors.newPassword =
        '${t("password_must_include_a_special_character")}';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------
  // SUBMIT HANDLER
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    if (!validate()) return; // stop if invalid
    try {
      setLoading(true);
      const body = new URLSearchParams();
      body.append("password", formData.newPassword);
      body.append("c_password", formData.confirmPassword);
      body.append("code", vfcode);
      body.append("customerID", customerID);

      const { data: res } = await API.post("/updatePassword", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });

      console.log("res : ", res);

      if (res.flag === "S") {
        setSuccessMsg(res.msg);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setServerError(res.msg);
      }
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong");
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
          <h2 className="text-lg font-medium text-gray-500 mb-1">
            {t("welcome")}
          </h2>
          <h1 className="text-2xl font-normal text-blue-600 mb-12">
            {t("set_your_new_password")}
          </h1>

          {/* Server or success messages */}
          {serverError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2 ml-4">
                {t("new_password")} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder={t("new_password")}
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
                {t("verify_password")}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("verify_password")}
                className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
              {loading ? `${t("updating")}` : `${t("update")}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
