import axios from "axios";
import Swal from "sweetalert2";

// =======================
// Axios Instance
// =======================
// isLoggingOut removed

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8086/api",
  timeout: 60000,
  // headers: { "Content-Type": "application/json" } // Removed to allow auto-detection (JSON vs Multipart)
});

// =======================
// Request Interceptor
// =======================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Attach token ONLY if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // DEBUG: Log headers to verify token is sent
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Response Interceptor
// =======================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status} - ${error.config.url}`, error.response.data);

      // Global 401/403 Handler
      if (error.response.status === 401 || error.response.status === 403) {
        // Dispatch custom event so AuthContext can hear it and logout
        // We use a custom event to decouple API from Context
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
