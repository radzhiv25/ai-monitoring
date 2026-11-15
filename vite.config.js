import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        // The `use client` directives in lucide-react are framework metadata;
        // this Vite app bundles only for the browser, where they have no effect.
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.id?.includes("/node_modules/lucide-react/")
        ) return;
        defaultHandler(warning);
      },
    },
  },
});
