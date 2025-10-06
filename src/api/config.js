import axios from "axios";
import { APP_URL } from "../config";
export const API = axios.create({
  baseURL: APP_URL, // Replace with your backend API URL
  withCredentials: true, // ✅ Important: send/receive cookies
});

