import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { type Plugin } from "vite"

const isLocalPath = (id: string) => {
  const fileSystemRoot = __dirname.split(/[\\/]/)[0] + "/" // e.g. "C:/" on windows or "/" on unix-based systems
  return [".", "/", fileSystemRoot].some(prefix =>
    id.replaceAll("\\", "/").startsWith(prefix)
  )
}
interface LibBundlePluginOptions {
  /** Define which entrypoints exist for the module */
  entries: Record<string, { path: string; outFile: string }>
  /** Disable the plugin in specific contexts (e.g. when running vitest) */
  disabled?: boolean
  /** Define modules which should be bundled with the package and not be shared with the installing UI */
  includeInBundle?: (string | RegExp)[]
}

const libBundle = ({
  disabled,
  entries,
  includeInBundle = [],
}: LibBundlePluginOptions): Plugin => {
  if (disabled) return { name: "lib-bundle-plugin" }
  const shouldBundle = (id: string) => {
    const forceBundling = includeInBundle.some(pattern =>
      typeof pattern === "string" ? id.startsWith(pattern) : pattern.test(id)
    )
    // explicitly bundle modules which match the includeInBundle patterns
    if (forceBundling) return true

    // otherwise only transform local source code, dependencies are installed and bundled by UIs
    return isLocalPath(id)
  }

  return {
    name: "lib-bundle-plugin",
    enforce: "pre",
    config: config => {
      config.build ??= {}
      config.build.sourcemap ??= true // enable sourcemaps for easier debugging
      config.build.minify ??= true // reduce size of the package, sourcemaps allow users to read the original source code
      config.build.copyPublicDir ??= false // we don't have any necessary assets to copy

      config.build.rollupOptions = {
        ...config.build.rollupOptions,
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
      },
    }),
  ],
}))
