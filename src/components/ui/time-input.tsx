import {
  type ChangeEvent,
  type HTMLProps,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react"

import "../../types/react.d"

import { InputBorder } from "./fragments/input-border"
import { hstack } from "../../styles/stack"
import { clamp } from "../../utils/clamp"
import { cn } from "../../utils/cn"

const getNumbers = (value: Temporal.PlainTime | string = "") => {
  if (value instanceof Temporal.PlainTime) {
    const hours = value.hour.toString().padStart(2, "0")
    const minutes = value.minute.toString().padStart(2, "0")
    return `${hours}${minutes}`
  }
  return value.replaceAll(/[^\d]+/g, "").slice(0, 4)
}

const parseNumbers = (value: string) => {
  const numbers = getNumbers(value)
  return {
    hours: clamp(Number(numbers.slice(0, 2)), 0, 23),
    minutes: clamp(Number(numbers.slice(2, 4)), 0, 59),
  }
}

const padTime = (value: string) => {
  const nums = getNumbers(value)
  switch (nums.length) {
    case 0:
      return "0000"
    case 1:
      return `0${nums}00`
    case 2:
      return `${nums}00`
    case 3:
      return `0${nums}`
    default:
      return nums
  }
}

const stringToTime = (numbers: string) => {
  const { hours, minutes } = parseNumbers(padTime(numbers))
  return new Temporal.PlainTime(hours, minutes)
}

const forceTime = (value: string) => {
  const padded = padTime(value)
  return stringToTime(padded)
}

const nextQuarter = (time: Temporal.PlainTime) => {
  const toNextQuarter = 15 - (time.minute % 15)
  const duration = new Temporal.Duration(0, 0, 0, 0, 0, toNextQuarter)
  const newTime = time.add(duration)

  const max = new Temporal.PlainTime(23, 59)
  const didOverflow = Temporal.PlainTime.compare(time, newTime) === 1
  return didOverflow ? max : newTime
}

const prevQuarter = (time: Temporal.PlainTime) => {
  const toPrevQuarter = time.minute % 15 || 15
  const duration = new Temporal.Duration(0, 0, 0, 0, 0, toPrevQuarter)
  const newTime = time.subtract(duration)

  const min = new Temporal.PlainTime(0, 0)
  const didOverflow = Temporal.PlainTime.compare(time, newTime) === -1
  return didOverflow ? min : newTime
}

type InputProps = HTMLProps<HTMLInputElement>
export interface TimeInputProps extends Pick<
  InputProps,
  | "onKeyDown"
  | "onKeyUp"
  | "onFocus"
  | "onBlur"
  | "className"
  | "disabled"
  | "ref"
> {
  value?: Temporal.PlainTime
  onChange?: (
    value: Temporal.PlainTime,
    event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) => void
}

const defaultValue = new Temporal.PlainTime()

export const TimeInput = ({
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  value = defaultValue,
  className,
  ...props
}: TimeInputProps) => {
  const [text, setText] = useState(getNumbers(value))

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needed to sync the input value when controlled value changes
    setText(state => {
      const next = getNumbers(value)
      const prev = getNumbers(forceTime(state))
      return next === prev ? state : next
    })
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const value = target.value
    const start = target.selectionStart
    const inserted =
      start === 5 ? value.slice(0, 3) + value.slice(4) : value.slice(0, 4)

    setText(inserted)
    onChange?.(stringToTime(inserted), event)
    target.value = inserted
    target.setSelectionRange(start, start)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)

    const key = event.key
    if (key.length === 1) {
      const isNumber = /\d/.test(event.key)
      if (!isNumber && !event.ctrlKey) event.preventDefault()
      return
    }

    if (key === "ArrowUp") {
      const time = nextQuarter(value)
      onChange?.(time, event)
      setText(getNumbers(time))
      event.preventDefault()
      event.skipGridNavigation = true
      return
    }
    if (key === "ArrowDown") {
      const time = prevQuarter(value)
      onChange?.(time, event)
      setText(getNumbers(time))
      event.preventDefault()
      event.skipGridNavigation = true
      return
    }
  }

  return (
    <InputBorder className={cn("w-15", className)}>
      <div
        aria-hidden
        className={cn(
          hstack({ align: "center", justify: "center" }),
          "pointer-events-none absolute inset-0 m-auto size-full text-sm [&:has(+input:focus)]:opacity-0"
        )}
      >
        {text.slice(0, 2).padEnd(2, "-")}
        <span className="mx-0.5 font-bold opacity-50">:</span>
        {text.slice(2, 4).padEnd(2, "-")}
      </div>

      <input
        {...props}
        type="text"
        className="w-full px-0 text-center outline-none not-focus:opacity-0"
        value={text}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={event => {
          event.currentTarget.focus()
          event.currentTarget.select()
          onFocus?.(event)
        }}
        onBlur={event => {
          setText(getNumbers(value))
          onBlur?.(event)
        }}
      />
    </InputBorder>
  )
}
