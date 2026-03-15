import { themes, create } from "storybook/theming"

import { version } from "../../package.json"

const shared = {
  fontBase: "Quicksand",
  fontCode: "Fira Code",

  brandTitle: `Boring Blocks (v${version})`,
  brandUrl: "./",
  brandTarget: "_self",
}

export const darkTheme = create({
  ...themes.dark,
  ...shared,
  brandImage: "./dark-mode-logo.png",
})

export const lightTheme = create({
  ...themes.light,
  ...shared,
  brandImage: "./light-mode-logo.png",
})
