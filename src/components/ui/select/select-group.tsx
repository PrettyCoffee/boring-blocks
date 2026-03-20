import { type PropsWithChildren } from "react"

import { Select as Primitive } from "@base-ui/react/select"

import { SelectSeparator } from "./select-separator"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"

export namespace SelectGroup {
  export interface Props extends ClassNameProp {
    label: string
    labelClassName?: string
  }
}

export const SelectGroup = ({
  className,
  label,
  labelClassName,
  children,
}: PropsWithChildren<SelectGroup.Props>) => (
  <Primitive.Group className={className}>
    <Primitive.Label
      className={cn("px-2 py-1.5 text-xs text-text-gentle", labelClassName)}
    >
      {label}
    </Primitive.Label>

    {children}

    <SelectSeparator className="[:last-child>&]:hidden" />
  </Primitive.Group>
)
SelectGroup.displayName = "Select.Group"
