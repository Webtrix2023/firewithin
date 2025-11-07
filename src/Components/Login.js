import React, { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { api, ensureCsrf } from "../api";
import { useLanguage } from "../LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { t, lang, changeLanguage } = useLanguage();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLogin = localStorage.getItem("is_logged_in");
    if (checkLogin) {
      navigate("/dashboard");
    }
  }, []);
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
        localStorage.setItem("name", res.data?.name || "");
        localStorage.setItem("email", res.data?.email || "");
        localStorage.setItem("customer_image", res.data?.customer_image || "");
        localStorage.setItem("authid", res.data?.customer_id || "");
        changeLanguage(res.data?.default_language || "en");
        localStorage.setItem(
          "default_language",
          res.data?.default_language || "en"
        );
        localStorage.setItem("is_logged_in", true);
        navigate("/dashboard");
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
    <>
      {/* Mobile: fixed 3-row grid in 100svh (no scroll). Desktop: original hero layout. */}
      <section className="md:bg-center md:bg-cover hero-bg md:min-h-screen">
        {/* MOBILE LAYOUT */}
        <div className="md:hidden grid grid-rows-[auto_1fr_auto] h-[100svh] overflow-hidden">
          {/* Top: logo / small brand line */}
          <header className="flex items-center justify-center pt-3">
            <div className="flex flex-col items-center">
              {/* swap with your logo asset */}
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">
                {t("app_name")}
              </span>
            </div>
          </header>
          {/* Middle: the form (centered, no extra margins) */}
          <main className="flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-5 py-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("email")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <FiMail
                      className={`text-xl ${
                        focused.email ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder={t("enter_email")}
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      onFocus={() => setFocused((p) => ({ ...p, email: true }))}
                      onBlur={() => setFocused((p) => ({ ...p, email: false }))}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t("password")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <FiLock
                      className={`text-xl ${
                        focused.password ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder={t("enter_password")}
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      onFocus={() =>
                        setFocused((p) => ({ ...p, password: true }))
                      }
                      onBlur={() =>
                        setFocused((p) => ({ ...p, password: false }))
                      }
                    />
                  </div>
                </div>
                {/* Actions */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-black text-white px-6 py-3 rounded-full transition
                      ${
                        loading
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-800"
                      }`}
                  >
                    {loading ? `${t("logging_in")}` : `${t("login")}`}
                  </button>
                  <Link
                    to="/forgot-password"
                    state={{ page: "login" }}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    {t("forgot_password")}
                  </Link>
                  <p className="text-[11px] text-gray-500">
                    {t("dont_have_account")}{" "}
                    <Link
                      to="/signup"
                      className="text-blue-500 hover:underline"
                    >
                      {t("register")}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </main>
          {/* Bottom: tiny footer link */}
          <footer className="flex items-center justify-center pb-3">
            <Link
              to="/"
              className="text-[11px] text-gray-500 hover:text-gray-700 underline"
            >
              © {new Date().getFullYear()} {t("fire_within")} ·{" "}
              {t("back_to_website")}
            </Link>
          </footer>
        </div>
        {/* DESKTOP LAYOUT (unchanged look) */}
        <div className="hidden md:flex min-h-screen flex-col justify-between">
          <div className="flex flex-1 items-center justify-around w-full px-6 py-16">
            <div className="hidden md:flex items-center text-white">
              {/* <h2 className="font-inter font-light text-[48px] md:text-[60px] lg:text-8xl md:leading-[125%] tracking-wide">
                {t("please_login")}
              </h2> */}
              <h2 className="font-inter font-light leading-[1.25] tracking-wide text-[clamp(3rem,6vw,6rem)]">
                {t("please_login")}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg w-[40%]">
              <div className="py-20 px-16">
                <h2 className="text-center mb-2 font-inter font-bold text-[28px] tracking-wide uppercase">
                  {t("app_name")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                  {error && (
                    <div className="mb-2 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block md:ml-12 text-sm font-normal font-inter text-slate-500 mb-2">
                      {t("email")}{" "}
                      <span className="text-red-500 text-base">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <FiMail
                        className={`text-2xl ${
                          focused.email ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder={t("enter_email")}
                        className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        onFocus={() =>
                          setFocused((p) => ({ ...p, email: true }))
                        }
                        onBlur={() =>
                          setFocused((p) => ({ ...p, email: false }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block md:ml-12 text-sm font-normal font-inter text-slate-500 mb-2">
                      {t("password")}{" "}
                      <span className="text-red-500 text-base">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <FiLock
                        className={`text-2xl ${
                          focused.password ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder={t("enter_password")}
                        className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        onFocus={() =>
                          setFocused((p) => ({ ...p, password: true }))
                        }
                        onBlur={() =>
                          setFocused((p) => ({ ...p, password: false }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 md:ml-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-black text-white font-inter px-8 py-3 rounded-full transition
                        ${
                          loading
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-gray-800"
                        }`}
                    >
                      {loading ? `${t("logging_in")}` : `${t("login")}`}
                    </button>

                    <Link
                      to="/forgot-password"
                      state={{ page: "login" }}
                      className="text-md text-gray-500 hover:underline"
                    >
                      {t("forgot_password")}
                    </Link>
                  </div>

                  <p className="text-gray-500 text-sm mt-6 md:ml-8">
                    {t("dont_have_account")}{" "}
                    <Link
                      to="/signup"
                      className="text-blue-500 hover:underline"
                    >
                      {t("Click_here_to_register")}
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default Login;
