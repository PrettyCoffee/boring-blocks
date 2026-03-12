import type { Preview } from "@storybook/react-vite"

import { AutoDocsTemplate } from "./blocks/AutoDocsTemplate"
import { CanvasDecorator } from "./blocks/CanvasDecorator"
import { mdxComponents } from "./blocks/mdxComponents"
import { ThemedDocsContainer } from "./blocks/ThemedDocsContainer"
import { darkTheme, lightTheme } from "./themes"

const preview = {
  tags: ["autodocs"],
  decorators: [CanvasDecorator],

  parameters: {
    controls: { expanded: true, sort: "requiredFirst" },
    docs: {
      page: AutoDocsTemplate,
      container: ThemedDocsContainer,
      components: mdxComponents,
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Introduction", "Changelog"],
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
} satisfies Preview

export default preview
