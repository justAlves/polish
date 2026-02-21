import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { auth } from "./auth";
import { currentApiUrl } from "./config";

const cookies = auth.getCookie();

export const api = axios.create({
  baseURL: currentApiUrl,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Cookie: cookies ? cookies : "",
  },
});

api.interceptors.request.use(async (config) => {
  const cookie = await SecureStore.getItemAsync("myapp.cookie");
  if (cookie) {
    config.headers.Cookie = cookie;
  }
  return config;
});
