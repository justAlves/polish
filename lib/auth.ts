import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { currentApiUrl } from "./config";

const auth = createAuthClient({
  baseURL: currentApiUrl,
  plugins: [
    expoClient({
      scheme: "polish",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
  ],
});

export { auth };

