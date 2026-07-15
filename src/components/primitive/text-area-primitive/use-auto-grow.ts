import { type RefObject, useCallback, useEffect, useLayoutEffect } from "react"

export interface AutoSizeConfig {
  minLines: number
  maxLines?: number
}

const parsePx = (value: string): number => {
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const resolveLineHeight = (styles: CSSStyleDeclaration): number => {
  const lineHeight = parsePx(styles.lineHeight)
  if (lineHeight > 0) return lineHeight

  // `line-height: normal` does not resolve to a pixel value, so approximate
  // it from the font size using a common default multiplier.
  const fontSize = parsePx(styles.fontSize)
  return (fontSize || 16) * 1.2
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

interface UseAutoSizeParams {
  ref: RefObject<HTMLTextAreaElement | null>
  config: AutoSizeConfig | null
}

export const useAutoGrow = ({ ref, config }: UseAutoSizeParams) => {
  const enabled = config !== null
  const minLines = config?.minLines
  const maxLines = config?.maxLines

  const updateSize = useCallback(() => {
    const element = ref.current
    if (!element || !enabled) return

    const styles = window.getComputedStyle(element)
    const lineHeight = resolveLineHeight(styles)
    const paddingY = parsePx(styles.paddingTop) + parsePx(styles.paddingBottom)
    const borderY =
      parsePx(styles.borderTopWidth) + parsePx(styles.borderBottomWidth)
    const isBorderBox = styles.boxSizing === "border-box"

    element.style.height = "auto"
    const { scrollHeight } = element

    // `scrollHeight` includes padding but not the border. Convert it into a
    // value that matches the element's box-sizing before applying it.
    const measuredHeight = isBorderBox
      ? scrollHeight + borderY
      : scrollHeight - paddingY

    // Extra space outside the content area for a border-box element.
    const boxExtra = isBorderBox ? paddingY + borderY : 0

    const minHeight = minLines == null ? 1 : minLines * lineHeight + boxExtra
    const maxHeight =
      maxLines == null
        ? Number.POSITIVE_INFINITY
        : maxLines * lineHeight + boxExtra

    // eslint-disable-next-line unicorn/consistent-destructuring
    element.style.height = `${clamp(measuredHeight, minHeight, maxHeight)}px`
    // eslint-disable-next-line unicorn/consistent-destructuring
    element.style.overflowY = measuredHeight > maxHeight ? "auto" : "hidden"
  }, [enabled, maxLines, minLines, ref])

  useLayoutEffect(() => {
    updateSize()
  })

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    const handleInput = () => updateSize()
    element.addEventListener("input", handleInput)

    let prevWidth = element.offsetWidth
    const observer = new ResizeObserver(() => {
      // Only react to width changes, height changes are self-inflicted.
      const width = element.offsetWidth
      if (width === prevWidth) return
      prevWidth = width
      updateSize()
    })
    observer.observe(element)

    return () => {
      element.removeEventListener("input", handleInput)
      observer.disconnect()
    }
  }, [enabled, ref, updateSize])

  return updateSize
}
