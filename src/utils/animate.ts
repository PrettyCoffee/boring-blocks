import { type CSSProperties } from "react"

import { thenable } from "./thenable"
import { ease } from "../styles/ease"
import { type Resolve } from "../types/resolve"

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

type AnimatableElement = HTMLElement | SVGElement

const toKebabCase = (text: string) =>
  text.replaceAll(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

const applyStyles = (element: AnimatableElement, styles: CSSProperties) => {
  Object.entries(styles).forEach(([name, value]) => {
    element.style.setProperty(toKebabCase(name), String(value))
  })
}

interface AnimateStepTransition {
  ease?: keyof typeof ease
  duration?: number
  at?: number
}
export type AnimateStep = [
  element: AnimatableElement,
  styles: CSSProperties,
  transition?: AnimateStepTransition,
]

interface Step {
  element: AnimatableElement
  styles: CSSProperties
  transition: Required<AnimateStepTransition>
}

type TransitionStyles = Required<
  Pick<
    CSSProperties,
    | "transitionTimingFunction"
    | "transitionDuration"
    | "transitionProperty"
    | "willChange"
  >
>

const prefersReducedMotion = () =>
  !window.matchMedia("(prefers-reduced-motion: no-preference)").matches

const noMotionSteps = (...steps: Step[]) => {
  steps.forEach(({ element, styles }) => {
    applyStyles(element, styles)
  })
  return Object.assign(thenable(), { cancel: () => null })
}

const applyStepStyles = ({ element, styles, transition }: Step) => {
  if (transition.duration === 0) {
    applyStyles(element, styles)
    return
  }

  const transitionStyles: TransitionStyles = {
    transitionTimingFunction: `cubic-bezier(${ease[transition.ease].join(",")})`,
    transitionDuration: `${transition.duration}ms`,
    transitionProperty: "all",
    willChange: [
      ...element.style.willChange.split(/\s*,\s*/).filter(Boolean),
      ...Object.keys(styles).map(toKebabCase),
    ].join(","),
  }

  applyStyles(element, transitionStyles)
  applyStyles(element, styles)
}

const animateStep = (step: Step) => {
  if (step.transition.duration === 0 && step.transition.at === 0) {
    return noMotionSteps(step)
  }

  let timeout: number
  let resolve: () => void
  const promise = new Promise<void>(resolveFn => (resolve = resolveFn))

  timeout = window.setTimeout(() => {
    applyStepStyles(step)
    timeout = window.setTimeout(resolve, step.transition.duration)
  }, step.transition.at)

  return Object.assign(promise, {
    cancel: () => {
      resolve()
      window.clearTimeout(timeout)
    },
  })
}

const animateSteps = (steps: Step[]) => {
  const tasks = steps.map(animateStep)
  return Object.assign(Promise.all(tasks).then(noop), {
    cancel: () => {
      tasks.forEach(task => task.cancel())
    },
  })
}

// Initialize all transition styles to make sure e.g. height can be transitioned
const prepareTransition = (steps: AnimateStep[]) => {
  steps.forEach(([element, changingStyles]) => {
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
    const styles: TransitionStyles = {
      transitionTimingFunction: element.style.transitionTimingFunction,
      transitionDuration: element.style.transitionDuration,
      transitionProperty: element.style.transitionProperty,
      willChange: element.style.willChange,
    }
    return [element, styles] as const
  })

  return () =>
    transitionReset.map(([element, styles]) => applyStyles(element, styles))
}

const convertSteps = (steps: AnimateStep[]) => {
  let last: Step["transition"] | undefined

  return steps.map<Step>(([element, styles, transition = {}]) => {
    const at = !last ? 0 : last.at + last.duration
    last = { ease: "linear", duration: 0, at, ...transition }
    return { element, styles, transition: last }
  })
}

const animateFn = (steps: AnimateStep[]) => {
  if (prefersReducedMotion()) {
    return noMotionSteps(...convertSteps(steps))
  }

  const resetTransitionStyles = createTransitionReset(steps)
  prepareTransition(steps)

  const runner = animateSteps(convertSteps(steps))
  void runner.then(resetTransitionStyles)
  return runner
}

const states = <
  TStates extends Record<string, CSSProperties>,
  TShared extends CSSProperties = {},
>(
  states: TStates & { shared?: TShared }
) => {
  const { shared, ...rest } = states
  type FinalState = Resolve<{
    [Name in keyof typeof rest]: Resolve<(typeof rest)[Name] & TShared>
  }>

  if (!shared) return rest as unknown as FinalState
  return Object.fromEntries(
    Object.entries(rest).map(([name, state]) => [name, { ...shared, ...state }])
  ) as {
    [Name in keyof typeof rest]: (typeof rest)[Name] & TShared
  }
}

export const animate = Object.assign(animateFn, { states })
