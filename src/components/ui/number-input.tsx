import { type ChangeEvent, type HTMLProps, useState } from "react"

import { Icon } from "./icon"
import { TitleTooltip } from "./tooltip"
import { alert as alertStyles } from "../../styles/alert"
import { hstack } from "../../styles/stack"
import { type AlertKind } from "../../types/alert"
import { clamp } from "../../utils/clamp"
import { cn } from "../../utils/cn"
import { mergeRefs } from "../../utils/merge-refs"

// TODO: Extract shared code with TextInput (i.e. InputBorder, InputAlertIcon, InputBaseProps)

const meassureText = (text: string, reference: HTMLElement) => {
  const element = document.createElement("span")
  element.style.font = window.getComputedStyle(reference).font
  element.style.display = "inline"
  element.style.position = "absolute"
  element.style.opacity = "0"
  element.innerHTML = text
  document.body.appendChild(element)
  const width = element.offsetWidth
  document.body.removeChild(element)
  return width
}

interface ParseNumberOptions {
  min?: number
  max?: number
}
const parseNumber = (
  value: string,
  { min = -Infinity, max = Infinity }: ParseNumberOptions = {}
) => {
  const string = /(-?\d*\.?\d*)/.exec(value)?.[0] ?? ""
  const number = Number.parseFloat(string)

  if (Number.isNaN(number)) {
    return { string, number: null }
  }

  const clamped = clamp(number, min, max)
  if (clamped !== number) {
    return { string: String(clamped), number: clamped }
  }

  return {
    string,
    number: Number.parseFloat(string) || null,
  }
}

type InputProps = HTMLProps<HTMLInputElement>
export interface NumberInputProps extends Pick<
  InputProps,
  | "ref"
  | "placeholder"
  | "id"
  | "style"
  | "className"
  | "disabled"
  | "onKeyDown"
  | "onKeyUp"
  | "onFocus"
  | "onBlur"
> {
  value?: number | null
  onChange?: (
    value: number | null,
    event: ChangeEvent<HTMLInputElement>
  ) => void
  unit?: string
  max?: number
  min?: number
  alert?: { kind: AlertKind; text: string }
}
export const NumberInput = ({
  ref,
  value,
  onChange,
  unit,
  className,
  placeholder = "",
  max,
  min,
  alert,
  style,
  ...props
}: NumberInputProps) => {
  const [internal, setInternal] = useState(String(value ?? ""))
  const [unitWidth, setUnitWidth] = useState(0)
  const [digitsWidth, setDigitsWidth] = useState(0)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { string, number } = parseNumber(event.currentTarget.value, {
      min,
      max,
    })
    setInternal(string)
    onChange?.(number, event)
  }

  return (
    <div
      className={cn(
        hstack({ inline: true, align: "center", justify: "center" }),
        "relative h-10 w-max rounded-md",
        "border border-stroke-muted invalid:border-alert-error",
        alert
          ? alertStyles[alert.kind].border
          : "hover:border-stroke [&:has(*:focus-visible)]:border-stroke-focus",
        className
      )}
      style={{
        ...style,
        // @ts-expect-error ts(2353)
        "--unit-width": `${unitWidth}px`,
        "--digits": `${digitsWidth}px`,
      }}
    >
      <input
        {...props}
        ref={mergeRefs(ref, element => {
          if (!element) return
          setDigitsWidth(
            Math.max(
              meassureText(placeholder, element),
              meassureText(internal, element)
            )
          )
        })}
        value={internal}
        onChange={handleChange}
        onBlur={() => setInternal(String(value ?? ""))}
        placeholder={placeholder}
        className={cn(
          "h-10 flex-1 bg-transparent px-3 text-end text-sm text-text outline-none placeholder:text-text-gentle",
          "w-[calc(var(--digits)+var(--unit-width)+theme(width.4)+theme(width.4))] pr-[calc(var(--unit-width)+theme(width.4))]",
          alert &&
            "w-[calc(var(--digits)+var(--unit-width)+theme(width.4)+theme(width.1))] pr-[calc(var(--unit-width)+theme(width.1))]",
          className
        )}
      />

      <span
        ref={element => {
          if (!element) return
          setUnitWidth(meassureText(unit ?? "", element))
        }}
        className="pointer-events-none absolute top-1/2 left-[calc(var(--digits)+theme(width.4)+theme(width.1))] -translate-y-1/2 text-sm text-text-muted"
      >
        {unit}
      </span>

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
