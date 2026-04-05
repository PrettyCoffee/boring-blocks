import { type PropsWithChildren, type HTMLProps } from "react"

import {
  type ClassNameProp,
  type DisableProp,
  type StyleProp,
} from "../../types/base-props"
import { Slot } from "../utility/slot"

type BaseHtmlProps = HTMLProps<HTMLElement>
type ButtonHtmlProps = HTMLProps<HTMLButtonElement>
type AnchorHtmlProps = HTMLProps<HTMLAnchorElement>

interface ButtonPropsOverloads {
  slot: Pick<
    BaseHtmlProps,
    "ref" | "aria-current" | "onFocus" | "onBlur" | "onClick"
  > & {
    asChild: true
    href?: undefined
    target?: undefined
  }
  link: Pick<
    AnchorHtmlProps,
    "ref" | "aria-current" | "onFocus" | "onBlur" | "target"
  > & {
    asChild?: undefined
    onClick?: undefined
    href: string
    target?: string
  }
  button: Pick<
    ButtonHtmlProps,
    "ref" | "aria-current" | "onFocus" | "onBlur"
  > & {
    asChild?: undefined
    onClick?: ButtonHtmlProps["onClick"]
    href?: undefined
    target?: undefined
  }
}

export type ButtonPrimitiveProps<
  TVariants extends keyof ButtonPropsOverloads = keyof ButtonPropsOverloads,
> = ButtonPropsOverloads[TVariants] & ClassNameProp & DisableProp & StyleProp

export const ButtonPrimitive = ({
  children,
  ...props
}: PropsWithChildren<ButtonPrimitiveProps>) => {
  if (props.asChild) {
    return <Slot {...props}>{children}</Slot>
  }
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
