import { type PropsWithChildren } from "react"

import { Select as Primitive } from "@base-ui/react/select"

import { interactive } from "../../../styles/interactive"
import { hstack } from "../../../styles/stack"
import { type ClassNameProp, type DisableProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { CheckIcon } from "../../icons"
import { ErrorBoundary } from "../../utility/error-boundary"
import { Icon } from "../icon"

export namespace SelectOption {
  export interface Props extends DisableProp, ClassNameProp {
    value: string | null
    label?: string
  }
}

export const SelectOption = ({
  value,
  label = value ?? "",
  children,
  disabled,
  className,
}: PropsWithChildren<SelectOption.Props>) => (
  <ErrorBoundary>
    <Primitive.Item
      value={value}
      label={label}
      disabled={disabled}
      className={cn(
        interactive({ disabled }),
        hstack({ align: "center", gap: 2 }),
        "underline-offset-2 outline-none focus-visible:text-highlight focus-visible:underline",
        "relative h-8 w-full rounded-md pr-8 pl-2 text-sm select-none",
        className
      )}
    >
      <Primitive.ItemText className="truncate">
        {children || label}
      </Primitive.ItemText>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <Primitive.ItemIndicator>
          <Icon icon={CheckIcon} size="sm" className="pointer-events-none" />
        </Primitive.ItemIndicator>
      </span>
    </Primitive.Item>
  </ErrorBoundary>
)
SelectOption.displayName = "Select.Option"
