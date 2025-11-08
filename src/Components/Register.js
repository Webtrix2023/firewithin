import React, { useState } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { API } from '../api/config';
import { toast } from 'react-toastify';
import { useLanguage } from "../LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t, lang, changeLanguage } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [focused, setFocused] = useState({ name: false, email: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Invalid email format';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
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
                navigate('/thank-you');
                setLoading(false);
            }else{
              toast.error(data.msg);
              setLoading(false);
            }
            
      // await API.post('/registerCustomer', formData, {
      //   headers: { 'Content-Type': 'application/json' },
      //   withCredentials: true,
      // });
      
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MOBILE: 3-row grid (logo / form / tiny footer link) — no scroll */}
      <section className="md:hidden grid grid-rows-[auto_1fr_auto] h-[100svh] overflow-hidden bg-white hero-bg">
        {/* Top logo/brand */}
        <header className="flex items-center justify-center pt-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 text-lg uppercase tracking-widest text-gray-500">
              {t("app_name")}
            </span>
          </div>
        </header>

        {/* Form card */}
        <main className="flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-5 py-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {serverError && (
                <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <FiUser className={`text-xl ${focused.name ? 'text-blue-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="name"
                    placeholder={t("enter_name")}
                    className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused(p => ({ ...p, name: true }))}
                    onBlur={() => setFocused(p => ({ ...p, name: false }))}
                    required
                  />
                </div>
                {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <FiMail className={`text-xl ${focused.email ? 'text-blue-600' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                  placeholder={t("enter_email")}
                    className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused(p => ({ ...p, email: true }))}
                    onBlur={() => setFocused(p => ({ ...p, email: false }))}
                    required
                  />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black text-white px-6 py-3 rounded-full transition
                    ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                >
                  {loading ? `${t("registering")}` : `${t("register")}`}
                </button>

                <Link to="/forgot-password" state={{ page: 'register' }} className="text-xs text-gray-500 hover:underline">
                  {t("forgot_password")}
                </Link>

                <p className="text-[11px] text-gray-500">
                  {t("already_account")}{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    {t("login")}
                  </Link>
                </p>
                <p className="pt-2 text-gray-500 text-sm text-center mt-6 md:ml-8"><a href="/">{t("back_to_website")}</a></p>
              </div>
            </form>
          </div>
        </main>

        {/* Tiny sticky footer link */}
        <Footer></Footer>
      </section>

      {/* DESKTOP: 2-column hero with background + compact typography */}
      <section className="hidden md:flex md:flex-col md:justify-between md:min-h-screen md:bg-center md:bg-cover hero-bg">
        <div className="flex flex-1 items-center justify-around w-full px-6 py-16">
          {/* Left hero copy */}
          <div className="hidden md:flex items-center text-white">
            <h2  className="font-light leading-[1.08] mb-5 text-[clamp(3rem,7.2vw,6.25rem)]">
                
              <span className="md:block">{t("please")}</span>
              <span className="md:block">{t("enter_your")}</span>
              <span className="md:block">{t("details_to")}</span>
              <span className="md:block">{t("register")}</span>
            </h2>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-lg w-[40%]">
            <div className="py-16 px-12">
              <h2 className="text-center mb-2 font-inter font-bold text-[26px] tracking-wide uppercase">
               {t("app_name")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 mt-2">
                {serverError && (
                  <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block md:ml-10 text-sm font-normal font-inter text-slate-600 mb-2">
                    {t("name")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiUser className={`text-2xl ${focused.name ? 'text-blue-600' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      placeholder={t("enter_name")}
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused(p => ({ ...p, name: true }))}
                      onBlur={() => setFocused(p => ({ ...p, name: false }))}
                      required
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600 md:ml-10">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block md:ml-10 text-sm font-normal font-inter text-slate-600 mb-2">
                    {t("email")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiMail className={`text-2xl ${focused.email ? 'text-blue-600' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder={t("enter_email")}
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused(p => ({ ...p, email: true }))}
                      onBlur={() => setFocused(p => ({ ...p, email: false }))}
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600 md:ml-10">{errors.email}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 md:ml-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-black text-white font-inter px-7 py-3 rounded-full transition
                      ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                  >
                    {loading ? `${t("registering")}` : `${t("register")}`}
                  </button>

                  <Link
                    to="/forgot-password"
                    state={{ page: 'register' }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                   {t("forgot_password")}
                  </Link>
                </div>

                <p className="text-gray-500 text-sm mt-6 md:ml-8">
                  {t("already_account")}{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    {t("click_here_to_login")}
                  </Link>
                </p>
                <p className="pt-2 text-gray-500 text-sm text-center mt-6 md:ml-8"><a href="/">{t("back_to_website")}</a></p>
              </form>
            </div>
          </div>
        </div>

        {/* Desktop footer (compact) */}
        <Footer />
      </section>
    </>
  );
};

export default Register;
