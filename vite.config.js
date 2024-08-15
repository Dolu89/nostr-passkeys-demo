import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WALC from "@lo-fi/webauthn-local-client/bundlers/vite";
import LDL from "@lo-fi/local-data-lock/bundlers/vite";
import LV from "@lo-fi/local-vault/bundlers/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WALC(), LDL(), LV()],

  optimizeDeps: {
    esbuildOptions: {
      // WALC uses "top-level await", which is ES2022+
      target: "es2022",
    },
  },

  build: {
    // WALC uses "top-level await", which is ES2022+
    target: "es2022",
  },
});
