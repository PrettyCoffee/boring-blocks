import {
  type CSSProperties,
  type PropsWithChildren,
  type TransitionEventHandler,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react"

import { Slot } from "./slot"
import { type RefProp, type ClassNameProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { mergeRefs } from "../../utils/merge-refs"

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion)").matches

const getHeight = (
  container: HTMLElement | null,
  height: number | string | undefined
) => {
  if (height === "auto") {
    const child = container?.firstElementChild
    if (!container || !child) return "0px"

    const { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } =
      window.getComputedStyle(container)

    const fullHeight =
      child.clientHeight +
      Number.parseInt(paddingTop) +
      Number.parseInt(paddingBottom) +
      Number.parseInt(borderTopWidth) +
      Number.parseInt(borderBottomWidth)

    return `${fullHeight}px`
  }

  return typeof height === "number" ? `${height}px` : height
}

interface HeightState {
  heightProp?: string | number
  height?: string
  container?: HTMLElement | null
}
const useHeight = () => {
  const [state, dispatch] = useReducer<HeightState, [HeightState]>(
    (prev, action = {}) => {
      const container = action.container ?? prev.container ?? null
      const heightProp = action.heightProp ?? prev.heightProp
      const height = action.height ?? getHeight(container, heightProp)

      const didChange = prev.height !== height || prev.heightProp !== heightProp
      return !didChange
        ? Object.assign(prev, { container })
        : { heightProp, height, container }
    },
    {}
  )
  return [state.height, dispatch] as const
}

export interface AnimateHeightProps
  extends ClassNameProp, RefProp<HTMLDivElement> {
  height?: number | string
  duration?: number

  onTransitionStart?: TransitionEventHandler<HTMLDivElement>
  onTransitionEnd?: TransitionEventHandler<HTMLDivElement>
}
export const AnimateHeight = ({
  ref,
  children,
  height: heightProp = "auto",
  duration: durationProp = 0,
  className,
  ...rest
}: PropsWithChildren<AnimateHeightProps>) => {
  const [height, updateHeight] = useHeight()
  const contentRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    updateHeight({ heightProp })
  }, [heightProp, updateHeight])

  useEffect(() => {
    if (!contentRef.current || heightProp !== "auto") return

    const resizeObserver = new ResizeObserver(() => updateHeight({}))
    resizeObserver.observe(contentRef.current)
    return () => resizeObserver.disconnect()
  }, [heightProp, updateHeight])

  const styles: CSSProperties = {
    height,
    overflow: "hidden",
    transitionProperty: "height",
    transitionDuration: prefersReducedMotion() ? "0.1ms" : durationProp + "ms",
  }

  return (
    <div
      ref={mergeRefs(ref, container => updateHeight({ container }))}
      style={styles}
      className={cn(className, "overflow-hidden")}
      {...rest}
    >
      <Slot ref={contentRef}>{children}</Slot>
    </div>
  )
}
