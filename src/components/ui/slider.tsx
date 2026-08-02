import { type HTMLProps, type ChangeEvent, useId } from "react"

import { css } from "goober"

import { hstack } from "../../styles/stack"
import { theme } from "../../theme"
import { cn } from "../../utils/cn"

const trackStyles = `
  box-sizing: border-box;
  background: ${theme.read("color.stroke.default")};
  height: var(--track-width);
  border-radius: 50vh;
`

const thumbStyles = `
  appearance: none;
  box-sizing: border-box;
  height: var(--thumb-size);
  width: var(--thumb-size);
  --half-height: calc((var(--thumb-size) / 2) - (var(--track-width) / 2));
  margin-top: calc(-1 * var(--half-height));
  
  border: var(--track-width) solid var(--thumb-color);
  border-radius: 50%;
  background: ${theme.read("color.background.default")};
  cursor: grab;
  `

const thumbHoverStyles = `
  --outline-width: calc((var(--slider-size) - var(--thumb-size)) / 2);
  outline: var(--outline-width) solid color-mix(var(--thumb-color) 30%, transparent);
  `

const thumbActiveStyles = `
  cursor: grabbing;
  `

const slider = css`
  --thumb-color: ${theme.read("color.stroke.button")};
  --track-width: 0.125rem;
  --slider-size: 2.5rem;
  --thumb-size: 1.25rem;

  appearance: none;
  display: inline-block;
  background: transparent;
  cursor: pointer;
  height: var(--slider-size);
  border-radius: 0.25rem;
  outline: none;

  &:active {
    cursor: grabbing;
  }
  &:focus-visible,
  &:active {
    --thumb-color: ${theme.read("color.accent")};
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

  &:hover,
  &:focus-visible {
    &::-moz-range-thumb {
      ${thumbHoverStyles}
    }

    input[type="range"]& {
      &::-webkit-slider-thumb {
        ${thumbHoverStyles}
      }
    }
  }

  &:active {
    &::-moz-range-thumb {
      ${thumbHoverStyles}
      ${thumbActiveStyles}
    }

    input[type="range"]& {
      &::-webkit-slider-thumb {
        ${thumbHoverStyles}
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
