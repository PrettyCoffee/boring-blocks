import "vitest/config"

import { resolve, parse } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const normalSlash = (path: string) => path.replaceAll("\\", "/")
const fileSystemRoot = parse(__dirname).root
const isLocalPath = (id: string) =>
  [".", "/", fileSystemRoot].some(root =>
    normalSlash(id).startsWith(normalSlash(root))
  )
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
    return forceBundling || isLocalPath(id)
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
          path: resolve(__dirname, "./src/index.ts"),
        },
        "src/index-utils": {
          outFile: "index-utils",
          path: resolve(__dirname, "./src/index-utils.ts"),
        },
        "src/index-icons": {
          outFile: "index-icons",
          path: resolve(__dirname, "./src/index-icons.ts"),
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
