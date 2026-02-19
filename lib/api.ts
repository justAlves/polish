import axios from "axios";

const API_URLS = {
  local: "http://192.168.0.14:3000",
  production: "https://polish-api.onrender.com",
};

export const currentApiUrl = API_URLS.local;

export const api = axios.create({
  baseURL: currentApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
