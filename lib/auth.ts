import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const auth = createAuthClient({
  baseURL: "https://polish-backend.onrender.com",
  plugins: [
    expoClient({
        scheme: "polish",
        storagePrefix: "myapp",
        storage: SecureStore,
    })
  ]
});

export {
    auth
}