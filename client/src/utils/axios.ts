import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

export default api;