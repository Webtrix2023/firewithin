import React, { useState } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { API } from '../api/config';

const Register = () => {
  const navigate = useNavigate();

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
      await API.post('/registerCustomer', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      navigate('/thank-you');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MOBILE: 3-row grid (logo / form / tiny footer link) — no scroll */}
      <section className="md:hidden grid grid-rows-[auto_1fr_auto] h-[100svh] overflow-hidden bg-white">
        {/* Top logo/brand */}
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
              {serverError && (
                <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <FiUser className={`text-xl ${focused.name ? 'text-blue-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
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
                  {loading ? 'Registering…' : 'Register'}
                </button>

                <Link to="/forgot-password" state={{ page: 'register' }} className="text-xs text-gray-500 hover:underline">
                  Forgot Password?
                </Link>

                <p className="text-[11px] text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Login
                  </Link>
                </p>
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

      {/* DESKTOP: 2-column hero with background + compact typography */}
      <section className="hidden md:flex md:flex-col md:justify-between md:min-h-screen md:bg-center md:bg-cover hero-bg">
        <div className="flex flex-1 items-center justify-around w-full px-6 py-16">
          {/* Left hero copy */}
          <div className="hidden md:flex items-center text-white">
            <h2  className="font-light leading-[1.08] mb-5 text-[clamp(3rem,7.2vw,6.25rem)]">
                
              <span className="md:block">Please</span>
              <span className="md:block">enter your</span>
              <span className="md:block">details to</span>
              <span className="md:block">Register</span>
            </h2>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-lg w-[40%]">
            <div className="py-16 px-12">
              <h2 className="text-center mb-2 font-inter font-bold text-[26px] tracking-wide uppercase">
                THE FIRE WITHIN
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
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiUser className={`text-2xl ${focused.name ? 'text-blue-600' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
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
                    {loading ? 'Registering…' : 'Register'}
                  </button>

                  <Link
                    to="/forgot-password"
                    state={{ page: 'register' }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <p className="text-gray-500 text-sm mt-6 md:ml-8">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Click here to login
                  </Link>
                </p>
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
