import { defineConfig } from "@lingui/cli"

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "de"],
  compileNamespace: "json",
  catalogs: [
    {
      path: "<rootDir>/src/locales/_{locale}",
      include: ["src"],
    },
  ],
})
