import { type HTMLProps, type ChangeEvent, type ReactNode } from "react"

import { useValue } from "../../hooks/use-value"

type InputProps = HTMLProps<HTMLInputElement>

export namespace SelectionBoxPrimitive {
  export type CheckedState = boolean | "indeterminate"
  export interface Props extends Pick<
    InputProps,
    "ref" | "value" | "name" | "disabled" | "className" | "style"
  > {
    type: "checkbox" | "radio"
    checked?: CheckedState
    initialChecked?: CheckedState
    onCheckedChange?: (
      checked: boolean,
      event: ChangeEvent<HTMLInputElement>
    ) => void
    children?: (checked: CheckedState) => ReactNode
  }
}
export const SelectionBoxPrimitive = ({
  type,
  checked: controlledChecked,
  initialChecked,
  onCheckedChange,
  children,
  className,
  style,
  ...inputProps
}: SelectionBoxPrimitive.Props) => {
  const [checked, setChecked] = useValue({
    controlledValue: controlledChecked,
    initialValue: initialChecked,
    defaultValue: false,
    onChange: onCheckedChange,
  })

  return (
    <div
      className={className}
      style={style}
      data-checked={checked === true ? true : undefined}
      data-indeterminate={checked === "indeterminate" ? true : undefined}
      data-unchecked={checked === false ? true : undefined}
      data-disabled={inputProps.disabled ? true : undefined}
    >
      <input
        type={type}
        checked={checked === true}
        onChange={event => setChecked(event.currentTarget.checked, event)}
        className="sr-only"
        {...inputProps}
      />
      {children?.(checked)}
    </div>
  )
}
