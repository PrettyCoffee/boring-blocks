import type { StorybookConfig } from "@storybook/react-vite"

const loadFonts = `
<link
  rel="preload"
  href="./fonts/FiraCode-Variable.ttf"
  as="font"
  type="font/ttf"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="./fonts/Quicksand-Variable.ttf"
  as="font"
  type="font/ttf"
  crossorigin="anonymous"
/>
<link rel="stylesheet" href="./fonts/fonts.css" />

<style>
  .sbdocs p {
    font-size: 1rem;
  }
</style>
`

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)", "../src/**/*.mdx"],
  addons: [
    "@storybook/addon-docs",
    import.meta.resolve("./addons/local-preset.ts"),
  ],
  framework: {
    name: "@storybook/react-vite",
    options: { strictMode: true },
  },
  core: { disableTelemetry: true },
  managerHead: head => `${head} ${loadFonts}`,
  previewHead: head => `${head} ${loadFonts}`,
}
export default config
