import { themes, create } from "storybook/theming"

const shared = {
  fontBase: "Quicksand",
  fontCode: "Fira Code",

  brandTitle: `Boring Blocks`,
  brandUrl: "./",
  brandTarget: "_self",
}

export const darkTheme = create({
  ...themes.dark,
  ...shared,
  brandImage: "/dark-mode-logo.png",
})

export const lightTheme = create({
  ...themes.light,
  ...shared,
  brandImage: "/light-mode-logo.png",
})
