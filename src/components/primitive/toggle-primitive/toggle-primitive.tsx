import { type HTMLProps, type Dispatch, type PropsWithChildren } from "react"

import { createContext } from "../../../utils/create-context"

type ToggleContextState = Pick<Root.Props, "checked">
const ToggleContext = createContext<ToggleContextState>("Toggle")

type SpanProps = HTMLProps<HTMLSpanElement>
type ButtonProps = HTMLProps<HTMLButtonElement>

export namespace Thumb {
  export interface Props extends Pick<
    SpanProps,
    "ref" | "className" | "style"
  > {}
}

export namespace Root {
  export interface Props extends Pick<
    ButtonProps,
    "disabled" | "ref" | "className" | "style"
  > {
    value?: { on?: string; off?: string }
    checked: boolean
    onChange?: Dispatch<boolean>
  }
}

export const Thumb = ({
  children,
  ...props
}: PropsWithChildren<Thumb.Props>) => {
  const { checked } = ToggleContext.useRequiredValue()
  return (
    <span
      {...props}
      data-checked={checked ? "" : undefined}
      data-unchecked={!checked ? "" : undefined}
    >
      {children}
    </span>
  )
}

export const Root = ({
  children,
  value = {},
  onChange,
  checked,
  ...props
}: PropsWithChildren<Root.Props>) => (
  <button
    {...props}
    type="button"
    role="switch"
    aria-checked={checked}
    value={checked ? (value.on ?? "on") : (value.off ?? "off")}
    onClick={() => onChange?.(!checked)}
    data-checked={checked ? "" : undefined}
    data-unchecked={!checked ? "" : undefined}
  >
    <ToggleContext value={{ checked }}>{children}</ToggleContext>
  </button>
)
