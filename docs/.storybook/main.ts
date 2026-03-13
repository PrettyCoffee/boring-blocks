import type { StorybookConfig } from "@storybook/react-vite"

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
}
export default config
