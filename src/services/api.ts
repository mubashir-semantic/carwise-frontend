import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast"; // Toast zaroor import karein

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Concurrent requests handle karne ke liye queue aur flag
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Token automatically attach karega
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: 401 catch karega aur token refresh karega
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // --- MAIN FIX YAHAN HAI ---
    // Check karein ke API route Auth ka toh nahi hai
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/google");

    // Agar Login/Signup pe 401 aaye, toh page refresh mat karein, component ko error handle karne dein
    if (error.response.status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }

    // Agar error 401 na ho (maslan 400, 500) toh bhi component ko bhej dein
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    // -------------------------

    // Refresh endpoint khud fail ho jaye toh infinite loop se bachayein
    if (originalRequest.url?.includes("/auth/refresh")) {
      logoutUser();
      return Promise.reject(error);
    }

    // Agar yeh request pehle hi retry ho chuki hai
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Agar token pehle se refresh ho raha ho, toh baqi requests ko queue mein daalein
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;

    if (!refreshToken) {
      isRefreshing = false;
      logoutUser();
      return Promise.reject(error);
    }

    try {
      // Direct axios call taake interceptor loop na bane
      const response = await axios.post(
        `${BASE_URL.replace(/\/+$/, "")}/auth/refresh-token`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      // Headers update karein aur queue wali requests ko execute karein
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logoutUser();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Agar user pehle se login page par nahi hai tabhi redirect karein
    if (window.location.pathname !== "/login") {
      toast.error("Session expired. Please log in again.", {
        id: "session-expired",
      });

      // Toast parhne ka time dein, phir login par redirect karein
      setTimeout(() => {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }, 1500);
    }
  }
}

export default api;
