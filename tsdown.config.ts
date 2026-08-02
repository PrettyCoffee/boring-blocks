import babelPlugin, { defineRolldownBabelPreset } from "@rolldown/plugin-babel"
import { defineConfig } from "tsdown"

const linguiPreset = defineRolldownBabelPreset({
  preset: () => ({ plugins: ["@lingui/babel-plugin-lingui-macro"] }),
  rolldown: {
    filter: {
      code: /from ['"]@lingui\/(?:react|core)\/macro['"]/,
    },
  },
})

const shared = defineConfig({
  dts: true,
  target: false,
  format: "esm",
  outDir: "dist",
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
})

const lib = defineConfig({
  ...shared,
  entry: "./src/index*.ts",
  plugins: [babelPlugin({ presets: [linguiPreset] })],
  tsconfig: "tsconfig.lib.json",
})

const tailwind = defineConfig({
  ...shared,
  entry: { tailwind: "tailwind/index.ts" },
  tsconfig: "tsconfig.node.json",
  dts: true,
})

export default defineConfig([lib, tailwind])
