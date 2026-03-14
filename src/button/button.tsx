import {
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  AnchorHTMLAttributes,
} from "react"

import {
  RefProp,
  ClassNameProp,
  DisableProp,
  StyleProp,
  TitleProp,
} from "../types/base-props"
import { cn } from "../utils/cn"

type ButtonHtmlProps = ButtonHTMLAttributes<HTMLButtonElement>
type AnchorHtmlProps = AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonOrAnchorProps =
  | (Pick<ButtonHtmlProps, "onClick" | "onFocus" | "onBlur"> &
      RefProp<HTMLButtonElement>)
  | (Pick<AnchorHtmlProps, "href" | "target" | "onFocus" | "onBlur"> &
      RefProp<HTMLAnchorElement>)

export type ButtonProps = ButtonOrAnchorProps &
  ClassNameProp &
  DisableProp &
  StyleProp &
  TitleProp

const ButtonOrAnchor = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  if ("href" in props) {
    return <a {...props}>{children}</a>
  }
  if ("onClick" in props) {
    return <button {...props}>{children}</button>
  }
  console.warn(
    "<Button> component did return null since it must either have an onClick or href prop"
  )
  return null
}

export const Button = ({
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <ButtonOrAnchor
    {...props}
    className={cn(
      "cursor-pointer rounded-md px-2 py-1 text-text hover:bg-background-button/10 focus-visible:bg-background-button/10 active:bg-background-button/20",
      className
    )}
  >
    {children}
  </ButtonOrAnchor>
)
