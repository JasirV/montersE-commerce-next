import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});
console.log("Base URL:", process.env.NEXT_PUBLIC_BASEURL);

api.interceptors.request.use(
  function (config) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
