import {
  useRef,
  type HTMLProps,
  type ChangeEvent,
  type MouseEvent,
  type KeyboardEventHandler,
  type FocusEventHandler,
} from "react"

import { Icon } from "./icon"
import { cn } from "../../utils/cn"
import { SearchIcon, XIcon } from "../icons"
import { IconButton } from "./icon-button"
import { TitleTooltip } from "./tooltip"
import { alert as alertStyles } from "../../styles/alert"
import { hstack } from "../../styles/stack"
import { type AlertKind } from "../../types/alert"
import { type ClassNameProp, type DisableProp } from "../../types/base-props"
import { mergeRefs } from "../../utils/merge-refs"

type InputProps = HTMLProps<HTMLInputElement>

export interface TextInputProps
  extends Pick<InputProps, "ref" | "placeholder">, ClassNameProp, DisableProp {
  type?: "text" | "search"
  value?: string
  alert?: { kind: AlertKind; text: string }

  onChange?: (
    value: string,
    event: MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLInputElement>
  ) => void
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}

export const TextInput = ({
  ref,
  alert,
  onChange,
  className,
  type = "text",
  ...props
}: TextInputProps) => {
  const textRef = useRef<HTMLInputElement>(null)
  const isSearch = type === "search"

  return (
    <div
      className={cn(
        hstack({ inline: true, align: "center", justify: "center" }),
        "relative h-10 w-full rounded-md",
        "border border-stroke-muted invalid:border-alert-error",
        alert
          ? alertStyles[alert.kind].border
          : "hover:border-stroke [&:has(*:focus-visible)]:border-stroke-focus",
        className
      )}
    >
      {isSearch && (
        <span className="pointer-events-none absolute inset-y-0 left-0 grid size-10 shrink-0 place-content-center">
          <Icon icon={SearchIcon} size="sm" color="muted" />
        </span>
      )}

      <input
        ref={mergeRefs(ref, textRef)}
        {...props}
        type={type}
        onChange={event => onChange?.(event.currentTarget.value, event)}
        className={cn(
          "h-10 w-full flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-text-gentle",
          isSearch && "pl-10",
          (isSearch || alert) && "pr-0"
        )}
      />

      {isSearch && !!props.value && (
        <span className="grid size-10 shrink-0 place-content-center [:not(:hover,:focus-within)>&]:opacity-0">
          <IconButton
            hideTitle
            // TODO: Translate title
            title="Clear text field"
            icon={XIcon}
            size="sm"
            onClick={event => {
              onChange?.("", event)
              textRef.current?.focus()
            }}
            className="rounded-sm"
          />
        </span>
      )}

      {alert && (
        <TitleTooltip title={alert.text}>
          <span className="grid size-10 shrink-0 place-content-center">
            <Icon
              icon={alertStyles[alert.kind].icon}
              color={alert.kind}
              size="sm"
            />
          </span>
        </TitleTooltip>
      )}
    </div>
  )
}
