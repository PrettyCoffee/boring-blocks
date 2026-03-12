import { type CSSProperties, type Ref } from "react"

export interface ClassNameProp {
  /** Pass custom styles to the component */
  className?: string
}

export interface DisableProp {
  /** Disable the component */
  disabled?: boolean
}

export interface TitleProp {
  /** Title tooltip to briefly describe the element / an action */
  title?: string
}

export interface StyleProp {
  /** Add custom CSS styles to the component */
  style?: CSSProperties
}

export interface RefProp<T> {
  /** Create references to native html elements */
  ref?: Ref<T>
}
