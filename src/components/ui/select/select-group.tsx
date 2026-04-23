import { type PropsWithChildren } from "react"

import { Select as Primitive } from "@base-ui/react/select"

import { SelectSeparator } from "./select-separator"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { ErrorBoundary } from "../../utility/error-boundary"

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
  <ErrorBoundary>
    <Primitive.Group className={className}>
      <Primitive.Label
        className={cn("px-2 py-1.5 text-xs text-text-gentle", labelClassName)}
      >
        {label}
      </Primitive.Label>

      {children}

      <SelectSeparator className="[:last-child>&]:hidden" />
    </Primitive.Group>
  </ErrorBoundary>
)
SelectGroup.displayName = "Select.Group"
