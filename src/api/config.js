import axios from "axios";
import { API_URL } from "../config";
export const API = axios.create({
  baseURL: API_URL, // Replace with your backend API URL
  withCredentials: true, // ✅ Important: send/receive cookies
});

