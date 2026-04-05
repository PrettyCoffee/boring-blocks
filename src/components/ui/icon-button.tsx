import { cva, type VariantProps } from "class-variance-authority"

import { Button, type ButtonProps } from "./button"
import { Icon, type IconProps } from "./icon"
import { type StyleProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { ErrorBoundary } from "../utility/error-boundary"
import { VisuallyHidden } from "../utility/visually-hidden"

const iconButton = cva("shrink-0", {
  variants: {
    size: {
      md: "size-10",
      sm: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface IconButtonProps
  extends
    VariantProps<typeof iconButton>,
    Pick<IconProps, "icon" | "filled">,
    Omit<ButtonProps, "look" | "icon" | "size">,
    StyleProp {
  title: string
  look?: Exclude<ButtonProps["look"], "link">
  hideTitle?: boolean
}

export const IconButton = ({
  icon,
  filled,
  title,
  look = "flat",
  size = "md",
  className,
  hideTitle,
  iconColor = "current",
  ...delegated
}: IconButtonProps) => (
  <ErrorBoundary>
    <Button
      {...(delegated as ButtonProps)}
      look={look}
      className={cn(iconButton({ size }), className)}
      title={hideTitle ? undefined : title}
    >
      <VisuallyHidden>{title}</VisuallyHidden>
      <Icon icon={icon} size="sm" color={iconColor} filled={filled} />
    </Button>
  </ErrorBoundary>
)
