import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import storybook from "eslint-plugin-storybook"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind({ entryPoint: "docs/src/index.css" }),
  prettyCozy.vitest,
  globalIgnores(["dist", "node_modules", "!./docs/.storybook"]),

  {
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },

  {
    files: ["./*", "docs/**"],
    rules: {
      "import-x/no-extraneous-dependencies": "off",
    },
  },

  {
    name: "local-rules/lib-imports",
    files: ["docs/src/**"],
    ignores: ["docs/src/lib/**"],
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
      // eslint-disable-next-line import-x/no-named-as-default-member
      storybook.configs["flat/recommended"],
      {
        name: "local-rules/check-file-naming",
        files: [".storybook/**"],
        rules: {
          "check-file/folder-naming-convention": "off",
          "storybook/no-uninstalled-addons": "off",
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
