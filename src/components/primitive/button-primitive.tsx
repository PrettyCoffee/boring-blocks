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

type SharedKeys =
  | "ref"
  | "aria-current"
  | "onPointerDown"
  | "onPointerUp"
  | "onPointerLeave"
  | "onPointerEnter"
  | "onFocus"
  | "onBlur"

interface ButtonPropsOverloads {
  slot: Pick<BaseHtmlProps, "onClick" | SharedKeys> & {
    asChild: true
    href?: undefined
    target?: undefined
  }
  link: Pick<AnchorHtmlProps, "target" | SharedKeys> & {
    asChild?: undefined
    onClick?: undefined
    href: string
    target?: string
  }
  button: Pick<ButtonHtmlProps, SharedKeys> & {
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
  const { asChild, ...slotProps } = props
  if (asChild) {
    return <Slot {...slotProps}>{children}</Slot>
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
