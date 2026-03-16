import { themes, create } from "storybook/theming"

import { version } from "../../package.json"

const shared = {
  fontBase: "Quicksand",
  fontCode: "Fira Code",

  brandTitle: `Boring Blocks (v${version})`,
  brandUrl: "./",
  brandTarget: "_self",
  brandImage: "./boring-blocks.webp",
}

export const darkTheme = create({
  ...themes.dark,
  ...shared,
})

export const lightTheme = create({
  ...themes.light,
  ...shared,
})
