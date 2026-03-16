import { type PropsWithChildren } from "react"

import { cva, VariantProps } from "class-variance-authority"

import { Icon, IconProps } from "./icon"
import { TitleTooltip, TitleTooltipProps } from "./tooltip"
import { interactive, InteractiveProps } from "../../styles/interactive"
import { IconProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import {
  ButtonPrimitive,
  ButtonPrimitiveProps,
} from "../primitive/button-primitive"
import { ErrorBoundary } from "../utility/error-boundary"

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

export type ButtonProps = ButtonPrimitiveProps &
  VariantProps<typeof button> &
  InteractiveProps &
  IconProp & {
    /** Title tooltip to briefly describe the element / an action */
    title?: string
    /** Position of the title tooltip. Will follow the cursor by default. */
    titleSide?: TitleTooltipProps["side"]
    iconColor?: IconProps["color"]
  }

export const Button = ({
  className,
  children,
  size,
  look,
  active,
  disabled,
  title,
  titleSide,
  icon,
  iconColor = "current",
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <ErrorBoundary>
    <TitleTooltip title={title} side={titleSide}>
      <ButtonPrimitive
        {...props}
        disabled={disabled}
        className={cn(
          button({ size }),
          interactive({ look, active, disabled }),
          className
        )}
      >
        {icon ? (
          <Icon
            color={iconColor}
            icon={icon}
            size={size === "sm" ? "xs" : "sm"}
            className="mr-2"
          />
        ) : null}
        {children}
      </ButtonPrimitive>
    </TitleTooltip>
  </ErrorBoundary>
)
