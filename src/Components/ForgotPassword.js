import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import Footer from "./Footer";
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { api, ensureCsrf } from '../api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '' });
  const [focused, setFocused] = useState({ email: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Safe fallback for back link
  const location = useLocation();
  const page = (location.state && location.state.page) ? location.state.page : '';
  const backPath = page ? `/${page}` : '/';
  const backLabel = page || 'home';

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
     try {
        //setMsg('If this email exists, a reset link has been sent.');

        const body = new URLSearchParams();
        body.append("email", formData.email);

        const {data:res} = await api.post("/sentVfCode", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        });

      if (res.flag === 'S') {
        toast.success('A reset link has been sent.');
        navigate('/login');
      } else {
        toast.error('A reset link has been sent.');
        setError(res.msg || 'Failed to send verification code');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MOBILE: no-scroll grid (logo / form / tiny footer link) */}
      <section className="md:hidden grid grid-rows-[auto_1fr_auto] h-[100svh] overflow-hidden hero-bg">
        {/* Top brand */}
        <header className="flex items-center justify-center pt-3">
          <div className="flex flex-col items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">
              THE FIRE WITHIN
            </span>
          </div>
        </header>

        {/* Form card */}
        <main className="flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-5 py-6">
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

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <FiMail className={`text-xl ${focused.email ? 'text-blue-600' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3 rounded-full outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused(p => ({ ...p, email: true }))}
                    onBlur={() => setFocused(p => ({ ...p, email: false }))}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black text-white px-6 py-3 rounded-full transition
                    ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                >
                  {loading ? 'Verifying…' : 'VERIFY'}
                </button>

                <Link to={backPath} className="text-xs text-gray-500 hover:underline">
                  Back to {backLabel}
                </Link>
              </div>
            </form>
          </div>
        </main>

        {/* Tiny sticky footer link */}
        <footer className="flex items-center justify-center pb-3">
          <Link to="/" className="text-[11px] text-gray-500 hover:text-gray-700 underline">
            © {new Date().getFullYear()} Fire Within · Back to website
          </Link>
        </footer>
      </section>

      {/* DESKTOP: two-column hero with background */}
      <section className="hidden md:flex md:flex-col md:justify-between md:min-h-screen md:bg-center md:bg-cover hero-bg">
        <div className="flex flex-1 items-center justify-around w-full px-6 py-16">
          {/* Left hero copy */}
          <div className="hidden md:flex items-center text-white">
            <h2 className="font-inter font-light leading-[1.08] tracking-wide text-[clamp(2.25rem,5vw,4rem)]">
              <span className="md:block">Forgot</span>
              <span className="md:block">password.</span>
            </h2>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-lg w-[40%]">
            <div className="py-16 px-12">
              <h2 className="text-center mb-2 font-inter font-bold text-[26px] tracking-wide uppercase">
                THE FIRE WITHIN
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 mt-2">
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
                  <label className="block md:ml-10 text-sm font-normal font-inter text-slate-600 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiMail className={`text-2xl ${focused.email ? 'text-blue-600' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      className="w-full placeholder:text-gray-300 shadow-sm border border-slate-200 px-4 py-3.5 rounded-full outline-none text-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused(p => ({ ...p, email: true }))}
                      onBlur={() => setFocused(p => ({ ...p, email: false }))}
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 md:ml-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-black text-white font-inter px-7 py-3 rounded-full transition
                      ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                  >
                    {loading ? 'Verifying…' : 'VERIFY'}
                  </button>

                  <Link to={backPath} className="text-sm text-gray-500 hover:underline">
                    Back to {backLabel}
                  </Link>
                </div>
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

export default ForgotPassword;
