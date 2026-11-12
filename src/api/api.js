import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {
    "Content-Type": "application/json"
  },
  timeout:8000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Parallel 401s share one refresh call instead of each sending their own.
let refreshing = null;

// assignment -> whenever we are asking for a new access token via refresh token route -> we should also update the refresh token;
const refreshAccessToken = () => {
  refreshing ??= axios
    .post("/api/auth/refresh-token",
      { refreshToken: localStorage.getItem("refreshToken") },
      { baseURL: api.defaults.baseURL, timeout: api.defaults.timeout })
    .then(({ data }) => {
      localStorage.setItem("token", data.token);
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.startsWith("/api/auth/") ||
      !localStorage.getItem("refreshToken")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      await refreshAccessToken();
    } catch (refreshError) {
      // Only a rejected refresh token ends the session; network or 5xx failures keep it.
      if (refreshError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
    // The request interceptor attaches the new token on this retry.
    return api(originalRequest);
  }
);
export default api;