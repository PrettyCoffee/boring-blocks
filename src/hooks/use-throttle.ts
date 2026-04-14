import { useEffect, useState } from "react"

const createThrottle = (delay: number) => {
  let lastCall = 0
  let lastFn: (() => void) | null
  let timeout: number | null = null

  const clear = () => {
    if (timeout) {
      window.clearTimeout(timeout)
      timeout = null
      lastFn = null
    }
  }

  const callFn = () => {
    lastCall = Date.now()
    lastFn?.()
    clear()
  }

  const set = (fn: () => void) => {
    const remaining = delay - (Date.now() - lastCall)
    lastFn = fn
    if (remaining <= 0) {
      callFn()
    } else {
      timeout = setTimeout(callFn, remaining)
    }
  }

  return Object.assign(set, { clear })
}

export const useThrottle = (delay: number) => {
  // eslint-disable-next-line react/hook-use-state -- explicitly only want to use initial value
  const throttle = useState(() => createThrottle(delay))[0]
  useEffect(() => () => throttle.clear(), [throttle])
  return throttle
}
