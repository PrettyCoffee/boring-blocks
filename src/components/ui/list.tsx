import {
  type HTMLAttributeAnchorTarget,
  type PropsWithChildren,
  type ReactNode,
} from "react"

import { Button } from "./button"
import { Icon } from "./icon"
import { IconButton } from "./icon-button"
import { hstack } from "../../styles/stack"
import {
  type IconProp,
  type ClassNameProp,
  type RefProp,
} from "../../types/base-props"
import { cn } from "../../utils/cn"
import { type ButtonPrimitiveProps } from "../primitive/button-primitive"

export interface ListItemProps extends ClassNameProp, RefProp<HTMLLIElement> {
  active?: boolean
}

const Item = ({
  className,
  active,
  children,
  ...props
}: PropsWithChildren<ListItemProps>) => (
  <li
    {...props}
    className={cn(
      hstack({}),
      active ? "border-highlight/50" : "border-text-gentle/10",
      "h-10 list-none rounded-sm border bgl-base-invert/10 *:h-full *:rounded-none *:first:rounded-l-sm *:last:rounded-e-sm hover:bgl-layer/5 has-focus-visible:bgl-layer/5",
      className
    )}
  >
    {children}
  </li>
)

type ListItemLabelProps = ButtonPrimitiveProps &
  IconProp & {
    target?: HTMLAttributeAnchorTarget
    label?: ReactNode
    labelAttachment?: ReactNode
  }

const Label = ({
  className,
  label,
  labelAttachment,
  icon,
  ...props
}: ListItemLabelProps) => (
  <Button
    {...props}
    className={cn(
      hstack({ justify: "start", align: "center" }),
      "flex-1 truncate",
      className
    )}
  >
    {icon && <Icon icon={icon} className="mr-2 -ml-1" />}
    <span className="truncate">{label}</span>
    {labelAttachment}
  </Button>
)

const Action = ({
  className,
  ...props
}: ButtonPrimitiveProps<"button" | "link"> &
  Required<IconProp> & { title: string }) => (
  <IconButton
    {...props}
    hideTitle
    look="flat"
    className={cn("[*:not(:hover):not(:focus-within)>&]:sr-only", className)}
  />
)

const Group = ({
  className,
  children,
  ...props
}: PropsWithChildren<ClassNameProp & RefProp<HTMLUListElement>>) => (
  <ul {...props} className={cn("space-y-1", className)}>
    {children}
  </ul>
)

export const List = {
  Group,
  Item,
  Label,
  Action,
}
