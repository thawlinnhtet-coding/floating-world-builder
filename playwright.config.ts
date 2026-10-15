import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 12_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5175",
    viewport: { width: 1440, height: 960 },
    channel: "chrome",
    headless: true,
    launchOptions: {
      args: [
        "--enable-webgl",
        "--ignore-gpu-blocklist",
        "--enable-unsafe-swiftshader",
      ],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "npm run db:migrate:test && npm run dev -- --mode test --port 5175",
    url: "http://127.0.0.1:5175/api/health",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
