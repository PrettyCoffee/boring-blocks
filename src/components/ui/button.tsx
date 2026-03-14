import {
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  AnchorHTMLAttributes,
} from "react"

import { cva, VariantProps } from "class-variance-authority"

import { interactive, InteractiveProps } from "../../styles/interactive"
import {
  RefProp,
  ClassNameProp,
  DisableProp,
  StyleProp,
  TitleProp,
} from "../../types/base-props"
import { cn } from "../../utils/cn"

const button = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap",
  {
    variants: {
      size: {
        md: "h-10 px-3",
        sm: "h-8 px-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type ButtonHtmlProps = ButtonHTMLAttributes<HTMLButtonElement>
type AnchorHtmlProps = AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonOrAnchorProps =
  | (Pick<ButtonHtmlProps, "onClick" | "onFocus" | "onBlur"> &
      RefProp<HTMLButtonElement>)
  | (Pick<AnchorHtmlProps, "href" | "target" | "onFocus" | "onBlur"> &
      RefProp<HTMLAnchorElement>)

export type ButtonProps = ButtonOrAnchorProps &
  VariantProps<typeof button> &
  InteractiveProps &
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
  return <span {...props}>{children}</span>
}

export const Button = ({
  className,
  children,
  size,
  look,
  active,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <ButtonOrAnchor
    {...props}
    className={cn(
      button({ size }),
      interactive({ look, active, disabled }),
      className
    )}
  >
    {children}
  </ButtonOrAnchor>
)
