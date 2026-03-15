import { type PropsWithChildren, HTMLProps } from "react"

import { ClassNameProp, DisableProp, StyleProp } from "../../types/base-props"

type ButtonHtmlProps = HTMLProps<HTMLButtonElement>
type AnchorHtmlProps = HTMLProps<HTMLAnchorElement>

type ButtonOrAnchorProps =
  | Pick<
      ButtonHtmlProps,
      "ref" | "aria-current" | "onFocus" | "onBlur" | "onClick"
    >
  | Pick<
      AnchorHtmlProps,
      "ref" | "aria-current" | "onFocus" | "onBlur" | "href" | "target"
    >

export type ButtonPrimitiveProps = ButtonOrAnchorProps &
  ClassNameProp &
  DisableProp &
  StyleProp

export const ButtonPrimitive = ({
  children,
  ...props
}: PropsWithChildren<ButtonPrimitiveProps>) => {
  if ("href" in props) {
    return <a {...props}>{children}</a>
  }
  if ("onClick" in props) {
    return <button {...props}>{children}</button>
  }
  console.warn(
    "<Button> component did return null since it must either have an onClick or href prop"
  )
  return <span {...props}>{children}</span>
}
