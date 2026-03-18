import { CSSProperties } from "react"

import { ease } from "../styles/ease"

const flush = () =>
  new Promise<void>(resolve => {
    window.setTimeout(resolve, 1)
  })

const toKebabCase = (text: string) =>
  text.replaceAll(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

const applyStyles = (element: HTMLElement, styles: CSSProperties) => {
  Object.entries(styles).forEach(([name, value]) => {
    element.style.setProperty(toKebabCase(name), String(value))
  })
}

// TODO: Extend with "transition.at" attribute to allow creating timelines. Default value should be previous.at + previous.duration. Example would be Checkbox checkmark -> stroke through label
// WHen doing this, warn user when starting multiple steps on one component with different transition styles.

export type AnimateStep = [
  element: HTMLElement,
  transition: { ease: keyof typeof ease; duration: number },
  styles: CSSProperties,
]

const animateStep = (...[element, transition, styles]: AnimateStep) => {
  const transitionStyles: CSSProperties = {
    transitionTimingFunction: `cubic-bezier(${ease[transition.ease].join(",")})`,
    transitionDuration: `${transition.duration}ms`,
    willChange: Object.keys(styles).map(toKebabCase).join(","),
  }

  let cancelled = false
  let cancel = () => {
    cancelled = true
  }

  const start = (resolve: () => void) => {
    if (cancelled) return

    cancel = () => {
      cancelled = true
      element.removeEventListener("transitionend", resolve)
      resolve()
    }

    applyStyles(element, transitionStyles)
    element.addEventListener("transitionend", resolve)
    applyStyles(element, styles)
  }

  const promise = new Promise<void>(resolve => start(resolve))
  return Object.assign(promise, {
    cancel: () => cancel(),
  })
}

// Initialize all transition styles to make sure e.g. height can be transitioned
const prepareTransition = (steps: AnimateStep[]) => {
  steps.forEach(([element, , changingStyles]) => {
    applyStyles(element, { transitionDuration: "0ms" })
    const styles = window.getComputedStyle(element)
    const initStyles = Object.fromEntries(
      Object.keys(changingStyles).map(name => [
        name,
        styles.getPropertyValue(name),
      ])
    )
    applyStyles(element, initStyles)
  })
}

const createTransitionReset = (steps: AnimateStep[]) => {
  const transitionReset = steps.map(([element]) => {
    const styles = {
      transitionTimingFunction: element.style.transitionTimingFunction,
      transitionDuration: element.style.transitionDuration,
      willChange: element.style.willChange,
    }
    return [element, styles] as const
  })

  return () =>
    transitionReset.map(([element, styles]) => applyStyles(element, styles))
}

export const animate = (steps: AnimateStep[]) => {
  let cancel: (() => void) | null = null
  const resetTransitionStyles = createTransitionReset(steps)

  prepareTransition(steps)

  const nextStep = async (...steps: AnimateStep[]): Promise<void> => {
    const [step, ...rest] = steps
    if (!step) return

    const current = animateStep(...step)
    cancel = current.cancel
    await current
    await flush()
    return nextStep(...(rest as [AnimateStep]))
  }

  return Object.assign(nextStep(...steps).then(resetTransitionStyles), {
    cancel: () => {
      cancel?.()
      resetTransitionStyles()
    },
  })
}
