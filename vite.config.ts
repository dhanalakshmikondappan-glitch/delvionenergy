import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    // Native tsconfig "paths" resolution (Vite 8+) — no separate plugin needed.
    tsconfigPaths: true,
  },
  define: {
    // Baked in once at build time and shared by both the prerender pass and
    // the client bundle, so the footer's copyright year can never differ
    // between server and client — calling `new Date()` at runtime in each
    // environment independently is exactly the kind of non-deterministic
    // render React's hydration-mismatch docs warn about.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    // Keep the client bundle honest against the performance budget in
    // docs/MASTER.md §38 — a silent regression here is worse than a loud one.
    chunkSizeWarningLimit: 400,
  },
});
