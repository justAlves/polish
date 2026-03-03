import axios from "axios";
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
