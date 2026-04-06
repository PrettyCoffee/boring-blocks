import {
  useCallback,
  useState,
  type Dispatch,
  type SyntheticEvent,
} from "react"

import { useLatest } from "./use-latest"

type AnyEvent = Event | SyntheticEvent

type Updater<TPrev, TValue> = TValue | ((prev: TPrev) => TValue)

export interface ValueProps<TValue> {
  value?: TValue
  initialValue?: TValue
  onChange?: Dispatch<TValue>
}

interface UseValueProps<
  TValue,
  TChangeValue extends TValue,
  TChangeEvent extends AnyEvent | undefined,
> {
  controlledValue: TValue | undefined
  initialValue: TValue | undefined
  defaultValue: TValue
  onChange?: (value: TChangeValue, event: TChangeEvent) => void | undefined
}

export const useValue = <
  TValue,
  TChangeValue extends TValue,
  TChangeEvent extends AnyEvent | undefined = undefined,
>({
  controlledValue,
  initialValue,
  defaultValue,
  onChange,
}: UseValueProps<TValue, TChangeValue, TChangeEvent>) => {
  const [internalState, setInternalState] = useState(
    initialValue ?? defaultValue
  )

  // eslint-disable-next-line react/hook-use-state -- explicitly only need the initial value
  const isControlled = useState(controlledValue !== undefined)[0]
  const value = isControlled ? (controlledValue as TValue) : internalState

  const lastValue = useLatest(value)

  const handleChange = useCallback(
    (
      next: Updater<TValue, TChangeValue>,
      ...[event]: TChangeEvent extends AnyEvent ? [TChangeEvent] : []
    ) => {
      const nextValue =
        next instanceof Function ? next(lastValue.current) : next
      if (!isControlled) setInternalState(nextValue)
      onChange?.(nextValue, event as TChangeEvent)
    },
    [isControlled, onChange, lastValue]
  )

  return [value, handleChange] as const
}
