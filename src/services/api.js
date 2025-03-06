import axios from "axios";

export const api = axios.create({
  baseURL: "https://adminpainel.store/api",
  //baseURL: "http://localhost:8080/api", 
  //baseURL: "https://15.229.12.246:8080/api", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;