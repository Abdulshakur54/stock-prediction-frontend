import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API;
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const no_csrf = ["/login", "/register"];
    const csrf_methods = ["post", "put", "delete", "patch"];
    if (!no_csrf.includes(config.url) && csrf_methods.includes(config.method)) {
      const csrfToken = localStorage.getItem("csrfToken");
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  // Handle failed responses
  async function (error) {

    if (["/protected/", "/logout/"].includes(error.config.url)) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;
        try {
          await axiosInstance.post("/refresh/");
          return axiosInstance(originalRequest);
        } catch (error) {
          console.log(error);
        }
      }
    } else if (error.config.url == "/refresh/") {
      if (error.response.status === 401) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("csrfToken");
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
