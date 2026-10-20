import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "samples-directory-index",
      generateBundle: {
        order: "post",
        handler(_, bundle) {
          const samples = bundle["samples.html"];
          if (!samples || samples.type !== "asset") {
            this.error("Expected samples.html in the build output.");
          }
          this.emitFile({
            type: "asset",
            fileName: "samples/index.html",
            source: samples.source,
          });
        },
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        samples: "samples.html",
      },
    },
  },
});
