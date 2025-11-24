import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import Footer from "./Footer";
import { useLocation, Link, useNavigate } from "react-router-dom";

import { api, ensureCsrf } from "../api";
import { toast } from "react-toastify";
import { useLanguage } from "../LanguageContext";
const ForgotPassword = ({ isModal, openLogin }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: "" });
  const [focused, setFocused] = useState({ email: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append("email", formData.email);

      const { data: res } = await api.post("/sentVfCode", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });

      if (res.flag === "S") {
        toast.success("A reset link has been sent.");
      } else {
        setError(res.msg || "Failed to send verification code");
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
    <div className="w-full max-w-md bg-white rounded-2xl p-6  opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {t("app_name")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {msg && (
          <div className="rounded-md bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
            {msg}
          </div>
        )}
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
              onFocus={() => setFocused({ email: true })}
              onBlur={() => setFocused({ email: false })}
              required
            />
          </div>
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
            {loading ? t("verifying") : t("verify")}
          </button>

          {/* Back to Login */}
          {isModal ? (
            <button
              type="button"
              onClick={openLogin} // switch modal back to login
              className="text-xs text-gray-500 hover:underline mt-1"
            >
              {t("back_to")} {t("login")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")} // fallback for standalone page
              className="text-xs text-gray-500 hover:underline mt-1"
            >
              {t("back_to")} {t("login")}
            </button>
          )}

          {/* Back to website */}
          {isModal && (
            <p className="pt-2 text-gray-500 text-sm text-center mt-6">
              <a href="/">{t("back_to_website")}</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
