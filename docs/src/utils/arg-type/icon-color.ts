import { type IconProps } from "boring-blocks"

import { baseArgType } from "./base-arg-type"

type IconColor = NonNullable<IconProps["color"]>
const colors: Record<IconColor, IconColor> = {
  default: "default",
  current: "current",
  gentle: "gentle",
  muted: "muted",
  highlight: "highlight",
  invert: "invert",
  info: "info",
  success: "success",
  warn: "warn",
  error: "error",
}

export const iconColor = Object.assign(baseArgType.enum("select", colors), {
  default: colors.default,
  values: colors,
})
