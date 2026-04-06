import { useRef, useEffect } from "react"

export const useLatest = <T>(value: T) => {
  const latest = useRef(value)
  useEffect(() => {
    latest.current = value
  }, [value])
  return latest
}
