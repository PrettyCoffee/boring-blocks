import { type ChangeEvent, type HTMLProps, useState } from "react"

import { type InputAlert, InputAlertIcon } from "./fragments/input-alert-icon"
import { InputBorder } from "./fragments/input-border"
import { useLocale } from "../../locales"
import { clamp } from "../../utils/clamp"
import { cn } from "../../utils/cn"
import { mergeRefs } from "../../utils/merge-refs"
import { ErrorBoundary } from "../utility/error-boundary"

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

const getNumberSeparator = (locale: string) => {
  const numberWithDecimalSeparator = 1.1
  return (
    Intl.NumberFormat(locale)
      .formatToParts(numberWithDecimalSeparator)
      .find(part => part.type === "decimal")?.value ?? "."
  )
}

interface ParseNumberOptions {
  min?: number
  max?: number
  locale: string
}
const numberToString = (
  value: number | undefined,
  { min = -Infinity, max = Infinity, locale }: ParseNumberOptions
) => {
  if (value === undefined) return ""
  const clamped = clamp(value, min, max)
  return Intl.NumberFormat(locale)
    .formatToParts(clamped)
    .filter(part => part.type !== "group")
    .map(part => part.value)
    .join("")
}
const stringToNumber = (
  value: string,
  { min = -Infinity, max = Infinity, locale }: ParseNumberOptions
) => {
  const decimalSeparator = getNumberSeparator(locale)
  const numberRegex = new RegExp(`(-?\\d*\\${decimalSeparator}?\\d*)`)
  const string = numberRegex.exec(value)?.[0] ?? ""
  const number = Number.parseFloat(string.split(decimalSeparator).join("."))

  if (Number.isNaN(number)) {
    return { string, number: undefined }
  }

  const clamped = clamp(number, min, max)
  if (clamped !== number) {
    return {
      string: numberToString(clamped, { min, max, locale }),
      number: clamped,
    }
  }

  return { string, number }
}

type InputProps = HTMLProps<HTMLInputElement>
export interface NumberInputProps extends Pick<
  InputProps,
  | "ref"
  | "placeholder"
  | "id"
  | "className"
  | "disabled"
  | "onKeyDown"
  | "onKeyUp"
  | "onFocus"
  | "onBlur"
> {
  value?: number | undefined
  onChange?: (
    value: number | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) => void
  unit?: string
  max?: number
  min?: number
  alert?: InputAlert
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
  ...props
}: NumberInputProps) => {
  const [internal, setInternal] = useState(String(value ?? ""))
  const [unitWidth, setUnitWidth] = useState(0)
  const [digitsWidth, setDigitsWidth] = useState(0)

  const locale = useLocale()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { string, number } = stringToNumber(event.currentTarget.value, {
      min,
      max,
      locale,
    })
    setInternal(string)
    onChange?.(number, event)
  }

  return (
    <ErrorBoundary>
      <InputBorder
        alert={alert?.kind}
        className={cn("w-max", className)}
        style={{
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
          onBlur={() =>
            setInternal(numberToString(value, { min, max, locale }))
          }
          placeholder={placeholder}
          className={cn(
            "h-10 flex-1 bg-transparent px-3 text-end text-sm text-text outline-none placeholder:text-text-muted",
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

        {alert && <InputAlertIcon alert={alert} />}
      </InputBorder>
    </ErrorBoundary>
  )
}
