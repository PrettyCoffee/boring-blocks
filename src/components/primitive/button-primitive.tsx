import { type PropsWithChildren, type HTMLProps } from "react"

import {
  type ClassNameProp,
  type DisableProp,
  type StyleProp,
} from "../../types/base-props"

type ButtonHtmlProps = HTMLProps<HTMLButtonElement>
type AnchorHtmlProps = HTMLProps<HTMLAnchorElement>

type ButtonOrAnchorProps =
  | (Pick<
      ButtonHtmlProps,
      "ref" | "aria-current" | "onFocus" | "onBlur" | "onClick"
    > & {
      href?: undefined
      target?: undefined
    })
  | (Pick<
      AnchorHtmlProps,
      "ref" | "aria-current" | "onFocus" | "onBlur" | "href" | "target"
    > & {
      onClick?: undefined
    })

export type ButtonPrimitiveProps = ButtonOrAnchorProps &
  ClassNameProp &
  DisableProp &
  StyleProp

export const ButtonPrimitive = ({
  children,
  ...props
}: PropsWithChildren<ButtonPrimitiveProps>) => {
  if (props.href) {
    return <a {...props}>{children}</a>
  }
  if (props.onClick) {
    return <button {...props}>{children}</button>
  }
  console.warn(
    "<Button> component did return null since it must either have an onClick or href prop"
  )
  return <span {...props}>{children}</span>
}
