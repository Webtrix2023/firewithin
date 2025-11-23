import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { api } from "../api";
import { useLanguage } from "../LanguageContext";

const Login = ({ openRegister, openForgot }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append("username", formData.email);
      body.append("password", formData.password);

      const { data: res } = await api.post("/getLogin", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });

      if (res.flag === "S") {
        // Store user info
        localStorage.setItem("name", res.data?.name || "");
        localStorage.setItem("email", res.data?.email || "");
        localStorage.setItem("customer_image", res.data?.customer_image || "");
        localStorage.setItem("authid", res.data?.customer_id || "");
        localStorage.setItem(
          "default_language",
          res.data?.default_language || "en"
        );
        localStorage.setItem("is_logged_in", true);
        window.location.href = "/dashboard"; // navigate after login
      } else {
        setError(res.msg || "Login failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl  opacity-0 animate-[fadeUp_1.5s_ease-out_forwards]">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {t("app_name")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs pl-3 font-medium text-slate-600 mb-1">
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
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs pl-3 font-medium text-slate-600 mb-1">
            {t("password")} <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 relative">
            {/* <FiLock
              className={`text-xl ${
                focused.password ? "text-gray-600" : "text-gray-400"
              }`}
            /> */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("enter_password")}
              className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, password: true }))}
              onBlur={() => setFocused((p) => ({ ...p, password: false }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white px-6 py-3 rounded-full transition  ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? t("logging_in") : t("login")}
          </button>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={openForgot}
            className="text-xs text-gray-500 hover:underline mt-1 "
          >
            {t("forgot_password")}
          </button>

          {/* Switch to Register */}
          <p className="text-[11px] text-gray-500 text-center mt-1">
            {t("dont_have_account")}{" "}
            <button
              type="button"
              onClick={openRegister}
              className="text-blue-500 hover:underline"
            >
              {t("register_now")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
