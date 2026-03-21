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

const WILL_CHANGE_MAP: Partial<Record<keyof CSSProperties, string>> = {
  transform: "transform",
  scale: "transform",
  rotate: "transform",
  translate: "transform",
  x: "transform",
  y: "transform",
  opacity: "opacity",
  filter: "filter",
  backdropFilter: "backdrop-filter",
  clipPath: "clip-path",
}

const getWillChange = (element: AnimatableElement) =>
  element.style.willChange.split(/\s*,\s*/).filter(Boolean)

const applyWillChange = (steps: Step[]) => {
  const changing = new Map<AnimatableElement, Set<string>>()

  for (const step of steps) {
    const properties =
      changing.get(step.element) ?? new Set(getWillChange(step.element))

    Object.keys(step.styles)
      .flatMap(key => WILL_CHANGE_MAP[key as keyof CSSProperties] ?? [])
      .forEach(key => properties.add(key))

    changing.set(step.element, properties)
  }

  changing.forEach((properties, element) => {
    applyStyles(element, { willChange: [...properties].join(",") })
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
    "transitionTimingFunction" | "transitionDuration" | "transitionProperty"
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
const prepareTransition = (steps: Step[]) => {
  steps.forEach(step => {
    applyStyles(step.element, { transitionDuration: "0ms" })
    const styles = window.getComputedStyle(step.element)
    const initStyles = Object.fromEntries(
      Object.keys(step.styles).map(name => [
        name,
        styles.getPropertyValue(name),
      ])
    )
    applyStyles(step.element, initStyles)
  })

  applyWillChange(steps)
}

const createTransitionReset = (steps: Step[]) => {
  const elements = new Set(steps.map(({ element }) => element))
  const transitionReset = [...elements].map(element => {
    const styles: TransitionStyles & { willChange: string } = {
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

const animateFn = (
  stepsArg: AnimateStep[],
  repeat: "once" | "loop" = "once"
) => {
  const steps = convertSteps(stepsArg)
  if (prefersReducedMotion()) {
    return noMotionSteps(...steps)
  }

  const resetTransitionStyles = createTransitionReset(steps)
  prepareTransition(steps)

  let runner = animateSteps(steps)
  if (repeat === "once") {
    resetTransitionStyles()
    return runner
  }

  let canceled = false
  let resolveFn: () => void
  const promise = new Promise<void>(resolve => (resolveFn = resolve))

  const run = () => {
    if (canceled) return resolveFn()

    runner = animateSteps(steps)
    void runner.then(run)
  }

  void runner.then(run)

  return Object.assign(promise, {
    cancel: () => {
      canceled = true
      runner.cancel()
      resetTransitionStyles()
    },
  })
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
