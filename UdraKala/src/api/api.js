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
    let normalizedError = {
      errorCode: "INTERNAL_ERROR",
      message: "Something went wrong on our end. Please try again in a few moments.",
      fieldErrors: null
    };

    if (error.response) {
      console.error(`[API Error] ${error.response.status} - ${error.config?.url}`, error.response.data);

      // Extract standardized error format if available
      if (error.response.data && error.response.data.errorCode) {
        normalizedError = { ...error.response.data };
      } else if (error.response.data && error.response.data.message) {
        // Fallback for any lingering legacy errors
        normalizedError.message = error.response.data.message;
        if (error.response.status === 401 || error.response.status === 403) normalizedError.errorCode = "ACCESS_DENIED";
      }

      // Global 401/403 Handler (only redirect if it's not an auth flow like login/register)
      if ((error.response.status === 401 || error.response.status === 403) && !error.config.url.includes('/auth/')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      
    } else {
      console.error(`[Network Error]`, error.message);
      normalizedError = {
        errorCode: "NETWORK_ERROR",
        message: "Couldn't connect. Check your internet connection and try again.",
        fieldErrors: null
      };
    }

    return Promise.reject(normalizedError);
  }
);

export default API;
