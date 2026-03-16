import { baseArgType } from "./base-arg-type"
import { icon } from "./icon"
import { iconColor } from "./icon-color"

export const argType = Object.assign(baseArgType, {
  props: { icon, iconColor },
})
