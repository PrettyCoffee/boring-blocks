import { cva, VariantProps } from "class-variance-authority"

import { Button, ButtonProps } from "./button"
import { Icon, IconProps } from "./icon"
import { StyleProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
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
    Omit<ButtonProps, "look" | "icon">,
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
  <Button
    {...(delegated as ButtonProps)}
    look={look}
    className={cn(iconButton({ size }), className)}
    title={hideTitle ? undefined : title}
  >
    <VisuallyHidden>{title}</VisuallyHidden>
    <Icon icon={icon} size="sm" color={iconColor} filled={filled} />
  </Button>
)
