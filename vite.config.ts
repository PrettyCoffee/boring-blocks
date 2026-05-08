import path from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const isModuleName = (id: string) =>
  !id.startsWith(".") && !id.startsWith("\0") && !path.isAbsolute(id)

interface LibBundleOptions {
  entries: Record<string, { path: string; outFile: string }>
  disabled?: boolean
  includeInBundle?: (string | RegExp)[]
}

const libBundle = ({
  disabled,
  entries,
  includeInBundle = [],
}: LibBundleOptions): Plugin => {
  if (disabled) return { name: "lib-bundle" }
  const shouldBundle = (id: string) => {
    const forceBundling = includeInBundle.some(pattern =>
      typeof pattern === "string" ? id.startsWith(pattern) : pattern.test(id)
    )
    return forceBundling || !isModuleName(id)
  }

  return {
    name: "lib-bundle",
    enforce: "pre",
    config: config => {
      config.build ??= {}
      config.build.sourcemap ??= false
      config.build.minify ??= false
      config.build.copyPublicDir ??= false

      config.build.rolldownOptions = {
        ...config.build.rolldownOptions,
        external: id => !shouldBundle(id),
      }

      config.build.lib = {
        ...config.build.lib,
        formats: ["es"],
        cssFileName: "index",
        entry: Object.fromEntries(
          Object.entries(entries).map(([key, { path }]) => [key, path])
        ),
        fileName: (format, entry) => {
          const filePath = entries[entry]?.outFile
          if (!filePath) throw new Error(`Unknown entry point: ${entry}`)

          if (["es", "esm", "module"].includes(format)) {
            return `${filePath}.mjs`
          }

          throw new Error(`Unsupported format "${format}"`)
        },
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    libBundle({
      disabled: command !== "build",
      entries: {
        "src/index": {
          outFile: "index",
          path: path.resolve(__dirname, "./src/index.ts"),
        },
        "src/index-utils": {
          outFile: "index-utils",
          path: path.resolve(__dirname, "./src/index-utils.ts"),
        },
        "src/index-icons": {
          outFile: "index-icons",
          path: path.resolve(__dirname, "./src/index-icons.ts"),
        },
        "src/index-theme": {
          outFile: "index-theme",
          path: path.resolve(__dirname, "./src/index-theme.ts"),
        },
      },
    }),
  ],
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
}))
