import { useEffect, useState } from "react"

const createDebounce = (delay: number) => {
  let timeout: number | null = null

  const clear = () => {
    if (!timeout) return
    clearTimeout(timeout)
    timeout = null
  }

  const set = (fn: () => void) => {
    clear()
    timeout = window.setTimeout(fn, delay)
  }

  return Object.assign(set, { clear })
}

export const useDebounce = (delay: number) => {
  // eslint-disable-next-line react/hook-use-state -- explicitly only want to use initial value
  const debounce = useState(() => createDebounce(delay))[0]
  useEffect(() => () => debounce.clear(), [debounce])
  return debounce
}
