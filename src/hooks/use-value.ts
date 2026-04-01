import {
  type SetStateAction,
  useCallback,
  useState,
  type Dispatch,
} from "react"

export interface ValueProps<TValue> {
  value?: TValue
  initialValue?: TValue
  onChange?: Dispatch<TValue>
}

interface UseValueProps<TValue> {
  controlledValue: TValue | undefined
  initialValue: TValue | undefined
  defaultValue: TValue
  onChange: Dispatch<TValue> | undefined
}

export const useValue = <TValue>({
  controlledValue,
  initialValue,
  defaultValue,
  onChange,
}: UseValueProps<TValue>) => {
  const [internalState, setInternalState] = useState(
    initialValue ?? defaultValue
  )

  // eslint-disable-next-line react/hook-use-state -- explicitly only need the initial value
  const isControlled = useState(controlledValue !== undefined)[0]
  const value = isControlled ? (controlledValue as TValue) : internalState

  const handleChange = useCallback(
    (next: SetStateAction<TValue>) => {
      const nextValue = next instanceof Function ? next(value) : next
      if (!isControlled) setInternalState(nextValue)
      onChange?.(nextValue)
    },
    [isControlled, onChange, value]
  )

  return [value, handleChange] as const
}
