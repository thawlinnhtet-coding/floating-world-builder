import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    cloudflare({
      viteEnvironment: { name: "worker" },
      ...(mode === "test"
        ? {
            persistState: { path: ".wrangler/test-state" },
            inspectorPort: false as const,
          }
        : {}),
    }),
  ],
  environments: { worker: { build: { sourcemap: true } } },
}));
