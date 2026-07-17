import { type HTMLProps, type ChangeEvent, useId } from "react"

import { css } from "goober"

import { hstack } from "../../styles/stack"
import { theme } from "../../theme"
import { cn } from "../../utils/cn"

const trackStyles = `
  background: ${theme.read("color.stroke.default")};
  height: var(--track-width);
  border-radius: 50vh;
`

const thumbStyles = `
  appearance: none;
  height: var(--slider-size);
  width: var(--slider-size);
  background: ${theme.read("color.background.default")};
  outline: var(--track-width) solid ${theme.read("color.stroke.button")};
  margin-top: -0.4rem;
  border-radius: 50%;
  cursor: grab;
  border: none;
  `

const thumbActiveStyles = `
  cursor: grabbing;
  `

const slider = css`
  --track-width: 0.125rem;
  --slider-size: 1rem;

  appearance: none;
  display: inline-block;
  background: transparent;
  cursor: pointer;
  height: 2rem;
  border-radius: 0.25rem;

  &:active {
    cursor: grabbing;
  }

  &::-moz-range-track {
    ${trackStyles}
  }
  &::-moz-range-thumb {
    ${thumbStyles}
  }

  input[type="range"]& {
    &::-webkit-slider-runnable-track {
      ${trackStyles}
    }
    &::-webkit-slider-thumb {
      ${thumbStyles}
    }
  }

  &:active {
    &::-moz-range-thumb {
      ${thumbActiveStyles}
    }

    input[type="range"]& {
      &::-webkit-slider-thumb {
        ${thumbActiveStyles}
      }
    }
  }
`

type BaseProps = HTMLProps<HTMLInputElement>

export interface SliderProps extends Pick<
  BaseProps,
  "className" | "style" | "onBlur" | "onFocus" | "disabled"
> {
  label: string
  unit?: string
  value: number
  onChange?: (value: number, event: ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
}

export const Slider = ({
  label,
  unit,
  style,
  className,
  value,
  onChange,
  ...props
}: SliderProps) => {
  const id = useId()

  return (
    <div className={cn("w-full", className)} style={style}>
      <div className={hstack({ justify: "between", align: "center" })}>
        <label htmlFor={id} className="text-sm text-text-gentle">
          {label}
        </label>
        <span className="text-sm text-text-gentle">
          {value}
          {!unit ? null : ` ${unit}`}
        </span>
      </div>
      <input
        {...props}
        id={id}
        type="range"
        value={value}
        onChange={event => onChange?.(Number(event.currentTarget.value), event)}
        className={cn(slider, "w-full text-text-priority")}
      />
    </div>
  )
}
