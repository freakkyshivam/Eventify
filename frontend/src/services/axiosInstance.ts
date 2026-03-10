import axios from 'axios'
 
const BASE_URL = import.meta.env.VITE_BACKEND_DEV_URL;

const api = axios.create({
  baseURL: BASE_URL ?? "http://localhost:3000/api/v1", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


let isRefreshing = false;
 
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

     
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/token/refresh")
    ) {
     

      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/token/refresh", { withCredentials: true });
        processQueue(null);
   
        return api(originalRequest);
      } catch (refreshError) {
        
        processQueue(refreshError);
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);



export default api;



