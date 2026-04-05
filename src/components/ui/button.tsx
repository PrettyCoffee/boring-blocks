import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react"

import { cva } from "class-variance-authority"

import { Icon, type IconProps } from "./icon"
import { TitleTooltip, type TitleTooltipProps } from "./tooltip"
import { interactive, type InteractiveProps } from "../../styles/interactive"
import { type IconProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { ExternalLink } from "../icons"
import {
  ButtonPrimitive,
  type ButtonPrimitiveProps,
} from "../primitive/button-primitive"
import { ErrorBoundary } from "../utility/error-boundary"

const isExternalLink = (href?: string) =>
  href && URL.canParse(href) && !href.includes(window.location.origin)

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
  IconProp & {
    /** Style (and importance) of the button. Defaults to "flat". */
    look?: NonNullable<InteractiveProps["look"]>
    /** Display the button as (usually temporarily) activated */
    active?: boolean
    /** Size of the button */
    size?: "md" | "sm"
    /** Title tooltip to briefly describe the element / an action */
    title?: string
    /** Position of the title tooltip. Will follow the cursor by default. */
    titleSide?: TitleTooltipProps["side"]
    /** Color of the displayed icon */
    iconColor?: IconProps["color"]
  }

const ButtonContent = ({
  icon,
  iconColor,
  size,
  href,
  look,
  children,
}: PropsWithChildren<
  Pick<ButtonProps, "icon" | "iconColor" | "size" | "href" | "look">
>) => (
  <>
    {icon ? (
      <Icon
        color={iconColor}
        icon={icon}
        size={size === "sm" ? "xs" : "sm"}
        className="mr-2"
      />
    ) : null}

    {children}

    {isExternalLink(href) && (
      <Icon
        icon={ExternalLink}
        className="absolute top-1 right-1 size-2.5!"
        color={
          (
            {
              key: "invert",
              flat: "muted",
              link: "muted",
              ghost: "default",
              destructive: "error",
            } as const
          )[look!]
        }
      />
    )}
  </>
)

const injectChildren = (
  asChild: boolean | undefined,
  children: ReactNode,
  content: ReactElement<ComponentProps<typeof ButtonContent>>
) => {
  const contentWithChildren = (children: ReactNode) =>
    cloneElement(content, { ...content.props, children })

  if (!asChild) return contentWithChildren(children)

  if (isValidElement<PropsWithChildren>(children)) {
    return cloneElement(children, {
      ...children.props,
      children: contentWithChildren(children.props.children),
    })
  }

  console.warn(
    "Using Button with asChild prop, but child is not a single react element."
  )
  return null
}

export const Button = ({
  className,
  children,
  size,
  look = "flat",
  active,
  disabled,
  title,
  titleSide,
  icon,
  iconColor = "current",
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const content = (
    <ButtonContent
      href={props.href}
      look={look}
      size={size}
      icon={icon}
      iconColor={iconColor}
    />
  )

  const child = injectChildren(props.asChild, children, content)

  return (
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
          {child}
        </ButtonPrimitive>
      </TitleTooltip>
    </ErrorBoundary>
  )
}
