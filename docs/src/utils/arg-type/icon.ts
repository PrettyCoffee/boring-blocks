import {
  CatIcon,
  BadgeAlertIcon,
  GithubIcon,
  ActivityIcon,
} from "boring-blocks/icons"

import { baseArgType } from "./base-arg-type"

const icons = {
  Activity: ActivityIcon,
  Cat: CatIcon,
  BadgeAlert: BadgeAlertIcon,
  Github: GithubIcon,
}

export const icon = Object.assign(baseArgType.enum("select", icons), {
  default: "Activity" as unknown as typeof icons.Activity,
  values: icons,
})
