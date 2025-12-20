import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8085/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    /* 🔴 1. Ignore cancelled requests (page reload / route change) */
    if (
      axios.isCancel(error) ||
      error.code === "ERR_CANCELED"
    ) {
      return Promise.reject(error);
    }

    /* 🔴 2. Ignore pure network errors (backend down / refresh) */
    if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      !error.response
    ) {
      console.warn("Network error or backend unreachable");
      return Promise.reject(error);
    }

    /* 🔴 3. Handle Unauthorized (401) */
    if (error.response.status === 401) {
      localStorage.removeItem("token");

      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please login again",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/login";
      });

      return Promise.reject(error);
    }

    /* 🔴 4. Handle Forbidden (403) */
    if (error.response.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to access this resource",
      });

      return Promise.reject(error);
    }

    /* 🔴 5. Real backend errors only */
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong. Please try again.";

    Swal.fire({
      icon: "error",
      title: "Request Failed",
      text: message,
      customClass: {
        popup:
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700",
        title: "text-gray-900 dark:text-white",
        content: "text-gray-600 dark:text-gray-300",
      },
    });

    return Promise.reject(error);
  }
);

export default api;
