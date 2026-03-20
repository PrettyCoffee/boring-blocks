import { cn } from "../utils/cn"

export const focusWithinOutline = cn(
  "[&:focus-visible,&:has(*:focus-visible)]:outline-2 [&:focus-visible,&:has(*:focus-visible)]:outline-offset-2 [&:focus-visible,&:has(*:focus-visible)]:outline-highlight [&:focus-visible,&:has(*:focus-visible)]:outline-solid"
)
