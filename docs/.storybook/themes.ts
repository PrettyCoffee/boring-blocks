import { themes, create } from "storybook/theming"

import { version } from "../../package.json"

/* eslint-disable unicorn/no-unused-properties */
const neutral = {
  "50": "#fafafa",
  "100": "#f5f5f5",
  "200": "#e5e5e5",
  "300": "#d4d4d4",
  "400": "#a3a3a3",
  "500": "#737373",
  "600": "#525252",
  "700": "#404040",
  "800": "#262626",
  "900": "#171717",
  "950": "#0a0a0a",
}
/* eslint-enable */

const shared = {
  fontBase: "Quicksand",
  fontCode: "Fira Code",

  brandTitle: `Boring Blocks (v${version})`,
  brandUrl: "https://github.com/PrettyCoffee/boring-blocks",
  brandTarget: "_self",
  brandImage: "./boring-blocks.webp",
}

export const darkTheme = create({
  ...themes.dark,
  ...shared,
  appBg: neutral["950"],
  appPreviewBg: neutral["950"],
  inputBg: neutral["950"],
  appContentBg: "#101010",
  barBg: "#101010",
  appBorderColor: "#1a1a1a",
  booleanBg: neutral["900"],
  booleanSelectedBg: neutral["800"],

  textColor: neutral["200"],
  barTextColor: neutral["400"],
  textMutedColor: neutral["400"],
  inputTextColor: neutral["200"],
})

export const lightTheme = create({
  ...themes.light,
  ...shared,
  appBg: neutral["100"],
  appPreviewBg: neutral["100"],
  inputBg: neutral["100"],
  appContentBg: "#fbfbfb",
  barBg: "#fbfbfb",
  appBorderColor: neutral["200"],
  booleanBg: neutral["200"],
  booleanSelectedBg: neutral["50"],

  textColor: neutral["800"],
  barTextColor: neutral["600"],
  textMutedColor: neutral["600"],
  inputTextColor: neutral["800"],
})
