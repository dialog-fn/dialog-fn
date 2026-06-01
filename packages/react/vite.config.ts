import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["lib", "src"],
      exclude: ["src/**/*.test.*", "examples/**"],
      rollupTypes: true,
      compilerOptions: { declaration: true },
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
      fileName: "main",
    },
    rollupOptions: {
      // core is inlined into src/core.ts (see scripts/gen-core.mjs), so the published
      // package is self-contained — both runtime and types — with nothing to externalize.
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
