import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WALC from "@lo-fi/webauthn-local-client/bundlers/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WALC()],

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
