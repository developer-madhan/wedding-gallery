import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    target: "es2020",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split rarely-changing, heavy vendor code into its own cacheable
        // chunks so a deploy that only touches app code doesn't invalidate
        // the vendor cache for returning visitors.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-dom") || id.includes("/react/")) return "vendor-react";
          if (id.includes("motion")) return "vendor-motion";
          if (id.includes("react-virtuoso")) return "vendor-virtuoso";
          if (id.includes("fuse.js")) return "vendor-search";
          if (id.includes("yet-another-react-lightbox")) return "vendor-lightbox";
          return "vendor";
        },
      },
    },
  },
});
