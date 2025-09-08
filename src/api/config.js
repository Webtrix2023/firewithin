import axios from "axios";

export const API = axios.create({
  baseURL: "https://firewithin.coachgenie.in", // Replace with your backend API URL
  withCredentials: true, // ✅ Important: send/receive cookies
});

