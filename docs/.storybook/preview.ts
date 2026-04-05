import "../src/index.css"

import type { Preview } from "@storybook/react-vite"

import { AutoDocsTemplate } from "./blocks/AutoDocsTemplate"
import { CanvasDecorator } from "./blocks/CanvasDecorator"
import { mdxComponents } from "./blocks/mdxComponents"
import { ThemedDocsContainer } from "./blocks/ThemedDocsContainer"
import { darkTheme, lightTheme } from "./themes"
import { argType } from "../src/utils/arg-type"

const preview = {
  tags: ["autodocs"],
  decorators: [CanvasDecorator],

  parameters: {
    controls: { expanded: true, sort: "requiredFirst" },
    actions: { argTypesRegex: "^on[A-Z].*" },
    docs: {
      page: AutoDocsTemplate,
      container: ThemedDocsContainer,
      components: mdxComponents,
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          "Changelog",
          "ThemeTokens",
          "Primitives",
          "Buttons",
          "Inputs",
          "Floating",
          "Feedback",
          "Layout",
        ],
      },
    },
    themes: { dark: darkTheme, light: lightTheme },
    backgrounds: {
      default: "light",
      values: [
        { name: "transparent", value: "transparent" },
        { name: "light", value: lightTheme.appBg },
        { name: "dark", value: darkTheme.appBg },
      ],
    },
  },

  argTypes: {
    className: argType.hidden(),
    children: argType.hidden(),
    style: argType.hidden(),
    ref: argType.hidden(),
  },
} satisfies Preview

export default preview
