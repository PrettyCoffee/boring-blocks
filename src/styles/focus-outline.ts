import { cn } from "../utils/cn"

const focusLocalOutline = cn(
  "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
)

const focusWithinOutline = cn(
  focusLocalOutline,
  "[&:has(*:focus-visible)]:outline [&:has(*:focus-visible)]:outline-offset-2 [&:has(*:focus-visible)]:outline-highlight [&:has(*:focus-visible)]:outline-solid"
)

export const focusOutline = {
  local: focusLocalOutline,
  within: focusWithinOutline,
}
