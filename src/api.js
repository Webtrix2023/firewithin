// import axios from 'axios';

// // If you're on Create React App, use REACT_APP_* env vars.
// // Example: REACT_APP_API_BASE=https://api.yourdomain.com
// //'https://firewithin.coachgenie.in' process.env.REACT_APP_API_BASE
// const baseURL = 'https://firewithin.coachgenie.in';// || 'http://localhost:8080';

// export const api = axios.create({
//   baseURL,
//   withCredentials: true, // send/receive CI3 session cookies
// });

// // (Optional) fetch CSRF and set default header
// export async function ensureCsrf() {
//   const { data } = await api.get('/auth/csrf'); // sets cookies
//   // save both name and value
//   api.defaults.headers.common['X-CSRF-TOKEN'] = data?.csrfHash || '';
//   api._csrf = { name: data?.csrfName, value: data?.csrfHash };
//   return api._csrf;
// };

// src/api/index.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://firewithin.coachgenie.in",
  withCredentials: true, // REQUIRED so ci_session is sent on every request
  headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
});

let csrfPromise = null; // single-flight
export async function ensureCsrf() {
  if (!csrfPromise) {
    csrfPromise = api.get("/auth/csrf").finally(() => (csrfPromise = null));
  }
  const { data } = await csrfPromise;
  const value = data?.csrfHash;
  api.defaults.headers["X-CSRF-TOKEN"] = value;
  return { name: data?.csrfName || "csrf_token", value };
}

// Interceptor: fetch CSRF for mutating methods; avoid recursion on /auth/csrf itself
api.interceptors.request.use(async (config) => {
  const m = (config.method || "get").toLowerCase();
  if (
    ["post", "put", "patch", "delete"].includes(m) &&
    !config.url?.includes("/auth/csrf")
  ) {
    const { name, value } = await ensureCsrf();
    const ct = String(config.headers?.["Content-Type"] || "");
    if (ct.includes("application/x-www-form-urlencoded") && config.data instanceof URLSearchParams) {
      if (!config.data.has(name)) config.data.append(name, value);
    } else {
      config.headers["X-CSRF-TOKEN"] = value;
    }
  }
  return config;
});

// If 403 (CSRF fail), refresh token once and retry
api.interceptors.response.use(
  r => r,
  async err => {
    const cfg = err?.config;
    if (!cfg || cfg._retry) throw err;
    if (err?.response?.status === 403) {
      cfg._retry = true;
      await ensureCsrf();
      return api.request(cfg);
    }
    throw err;
  }
);
