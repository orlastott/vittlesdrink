import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: path.resolve(__dirname, "client"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),  // ← ADD THIS
      "@assets": path.resolve(__dirname, "client/public/images"),
    },
  },

  plugins: [react()],

  build: {
    outDir: path.resolve(__dirname, "client/dist"),
    emptyOutDir: true,
  },
});
