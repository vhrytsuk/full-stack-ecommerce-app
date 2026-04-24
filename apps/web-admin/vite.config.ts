import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@ui": fileURLToPath(new URL("../../packages/ui/src", import.meta.url)),
      "@contracts": fileURLToPath(
        new URL("../../packages/api-contracts/src", import.meta.url),
      ),
      "@utils": fileURLToPath(new URL("../../packages/utils/src", import.meta.url)),
    },
  },
});
