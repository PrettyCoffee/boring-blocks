import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import storybook from "eslint-plugin-storybook"

const storybookConfig = defineConfig({
  basePath: "./docs",

  rules: {
    "import-x/no-extraneous-dependencies": "off",
  },

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

    {
      name: "local-rules/lib-imports",
      files: ["src/**"],
      ignores: ["src/lib/**"],
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
  ],
})

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind({ entryPoint: "docs/src/index.css" }),
  prettyCozy.vitest,
  globalIgnores(["dist", "node_modules", "!./docs/.storybook"]),

  storybookConfig,

  {
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports", prefer: "type-imports" },
      ],
    },
  },

  {
    name: "local-rules/lib-imports",
    files: ["src/**"],
    ignores: ["src/components/icons/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["lucide-react"],
              importNamePattern: "^",
              message: "Import from /components/icons instead.",
            },
          ],
        },
      ],
    },
  },

  prettyCozy.prettier
)
