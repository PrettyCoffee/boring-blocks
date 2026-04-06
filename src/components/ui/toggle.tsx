import { interactive } from "../../styles/interactive"
import { hstack } from "../../styles/stack"
import { cn } from "../../utils/cn"
import { TogglePrimitive } from "../primitive/toggle-primitive"
import { ErrorBoundary } from "../utility/error-boundary"

export interface ToggleProps extends TogglePrimitive.Root.Props {
  label: string
}

const toggleTransition = cn(
  "transition-[translate,background-color] duration-200 ease-out"
)

export const Toggle = ({
  ref,
  checked,
  onChange,
  value,
  label,
  className,
  disabled,
  ...rest
}: ToggleProps) => (
  <ErrorBoundary>
    <label
      {...rest}
      className={cn(
        hstack({ gap: 2, align: "center", inline: true }),
        interactive({ look: "flat", disabled }),
        "h-10 cursor-pointer truncate rounded-md p-1 pr-3 pl-2 text-start text-sm",
        className
      )}
    >
      <TogglePrimitive.Root
        ref={ref}
        checked={checked}
        onChange={onChange}
        value={value}
        disabled={disabled}
        className={cn(
          toggleTransition,
          "inline-block h-6 w-10 shrink-0 cursor-pointer rounded-lg bg-background-button/25 p-0.5",
          "data-checked:bg-highlight/50"
        )}
      >
        <TogglePrimitive.Thumb
          className={cn(
            toggleTransition,
            "inline-block size-5 rounded-lg bg-background-page/75",
            "data-checked:translate-x-2 data-unchecked:-translate-x-2"
          )}
        />
      </TogglePrimitive.Root>

      <span className="truncate">{label}</span>
    </label>
  </ErrorBoundary>
)
