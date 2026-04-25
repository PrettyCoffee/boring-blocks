import { parseColor } from "./parse-color"

export const parseOklch = (value: string) => {
  const color = parseColor(value)
  if (color?.mode !== "oklch") {
    throw new Error(`String "${value}" could not be parsed as oklch color.`)
  }
  const [light, chroma, hue] = color.color
  return { light, chroma, hue, alpha: color.alpha }
}
