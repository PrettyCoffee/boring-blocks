import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import storybook from "eslint-plugin-storybook"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.vitest,
  globalIgnores(["dist", "node_modules", "!./docs/.storybook"]),

  {
    basePath: "./docs",
    extends: [
      storybook.configs["flat/recommended"],
      {
        name: "local-rules/check-file-naming",
        files: [".storybook/**"],
        rules: {
          "checkFile/folder-naming-convention": "off",
        },
      },
    ],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  prettyCozy.prettier
)
