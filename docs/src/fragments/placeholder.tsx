import { cn } from "boring-blocks/utils"

export const Placeholder = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-40 w-full stroke-stroke/50", className)}
    strokeLinecap="round"
    fill="transparent"
    strokeWidth={2}
  >
    <rect width="100%" height="100%" />
    <line x1="10%" y1="10%" x2="90%" y2="90%" />
    <line x1="10%" y1="90%" x2="90%" y2="10%" />
  </svg>
)
