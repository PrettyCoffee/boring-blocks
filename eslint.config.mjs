import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import storybook from "eslint-plugin-storybook"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.vitest,
  globalIgnores(["dist", "node_modules", "!./docs/.storybook"]),

  {
    files: ["./*", "docs/*"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },

  {
    name: "local-rules/lib-imports",
    ignores: ["src/lib/**", "docs/src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@yaasl/*"],
              importNamePattern: "^",
              message: "Import from lib/yaasl instead.",
            },
          ],
        },
      ],
    },
  },

  {
    basePath: "./docs",
    extends: [
      // eslint-disable-next-line import/no-named-as-default-member
      storybook.configs["flat/recommended"],
      {
        name: "local-rules/check-file-naming",
        files: [".storybook/**"],
        rules: {
          "checkFile/folder-naming-convention": "off",
          "storybook/no-uninstalled-addons": "off",
        },
      },
    ],
    rules: {
      "checkFile/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  prettyCozy.prettier
)
