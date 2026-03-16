import { Cat, BadgeAlert, Github, Activity } from "boring-blocks/icons"

import { baseArgType } from "./base-arg-type"

const icons = {
  Activity,
  Cat,
  BadgeAlert,
  Github,
}

export const icon = Object.assign(baseArgType.enum("select", icons), {
  default: "Activity" as unknown as typeof icons.Activity,
  values: icons,
})
