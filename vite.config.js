import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/Lab12/",
  build: {
    outDir: "../dist"
  },
  test: {
    environment: "happy-dom",
    globals: true
  }
});