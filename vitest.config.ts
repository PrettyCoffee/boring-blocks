/// <reference types="vitest/config" />

import babelPlugin, { defineRolldownBabelPreset } from "@rolldown/plugin-babel"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const linguiPreset = defineRolldownBabelPreset({
  preset: () => ({ plugins: ["@lingui/babel-plugin-lingui-macro"] }),
  rolldown: {
    filter: {
      code: /from ['"]@lingui\/(?:react|core)\/macro['"]/,
    },
  },
})

export default defineConfig({
  plugins: [react(), babelPlugin({ presets: [linguiPreset] })],
  resolve: { tsconfigPaths: true },
  test: {
    dir: "src",
    include: ["**/*.test.*"],
    setupFiles: ["tests/test-setup.ts"],
    environment: "happy-dom",
    isolate: false,
    pool: "threads",
    watch: false,
  },
})
