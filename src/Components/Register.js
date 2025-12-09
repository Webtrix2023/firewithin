import React, { useState } from "react";
import { FiUser, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import { API } from "../api/config";
import { useLanguage } from "../LanguageContext";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ openLogin, openForgot }) => {
  // openLogin: function to switch to login modal
  // openForgot: function to handle forgot password modal
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [focused, setFocused] = useState({ name: false, email: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      next.email = "Invalid email format";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const body = new URLSearchParams();
      body.append("name", formData?.name);
      body.append("email", formData?.email);
      const { data } = await API.post("/registerCustomer", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "*/*",
        },
        withCredentials: true,
      });
      if (data.flag === "S") {
        navigate("/thank-you");
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl 
    opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {t("app_name")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {serverError}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-xs pl-3 font-medium text-slate-600 mb-1">
            {t("name")} <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {/* <FiUser
              className={`text-xl ${
                focused.name ? "text-gray-500" : "text-gray-400"
              }`}
            /> */}
            <input
              type="text"
              name="name"
              placeholder={t("enter_name")}
              className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, name: true }))}
              onBlur={() => setFocused((p) => ({ ...p, name: false }))}
              required
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium pl-3 text-slate-600 mb-1">
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {/* <FiMail
              className={`text-xl ${
                focused.email ? "text-gray-600" : "text-gray-400"
              }`}
            /> */}
            <input
              type="email"
              name="email"
              placeholder={t("enter_email")}
              className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, email: true }))}
              onBlur={() => setFocused((p) => ({ ...p, email: false }))}
              required
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white px-6 py-3 rounded-full transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? `${t("registering")}` : `${t("register")}`}
          </button>

          {/* Forgot Password */}
          {/* <button
            type="button"
            onClick={openForgot}
            className="text-xs text-gray-500 hover:underline mt-1"
          >
            {t("forgot_password")}
          </button> */}

          {/* Switch to Login */}
          <p className="text-[11px] text-gray-500 text-center mt-1">
            {t("already_account")}{" "}
            <button
              type="button"
              onClick={openLogin}
              className="text-blue-500 hover:underline"
            >
              {t("login")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
