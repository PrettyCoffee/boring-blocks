import { type CSSProperties, type Ref } from "react"

import { LucideIcon } from "../components/icons"

export interface IconProp {
  /** Display an icon inside the component */
  icon?: LucideIcon
}

export interface ClassNameProp {
  /** Pass custom styles to the component */
  className?: string
}

export interface DisableProp {
  /** Disable the component */
  disabled?: boolean
}

export interface StyleProp {
  /** Add custom CSS styles to the component */
  style?: CSSProperties
}

export interface RefProp<T> {
  /** Create references to native html elements */
  ref?: Ref<T>
}
