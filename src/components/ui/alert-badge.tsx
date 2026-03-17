import { useEffect, useState } from "react"

import { VariantProps, cva } from "class-variance-authority"

import { cn } from "../../utils/cn"

const alertBadge = cva(
  [
    "pointer-events-none absolute top-2 right-2 inline-block size-2 rounded-full transition-opacity duration-300 ease-in-out",
    "after:absolute after:inset-0 after:animate-ping after:rounded-full",
  ],
  {
    variants: {
      kind: {
        success: "bg-alert-success/75 after:bg-alert-success",
        warn: "bg-alert-warn/75 after:bg-alert-warn",
        error: "bg-alert-error/75 after:bg-alert-error",
        info: "bg-alert-info/75 after:bg-alert-info",
      },
      hidden: {
        true: "opacity-0",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      kind: "info",
      hidden: false,
    },
  }
)

export type AlertBadgeProps = VariantProps<typeof alertBadge>

export const AlertBadge = ({
  kind: kindProp,
  hidden,
  ...props
}: AlertBadgeProps) => {
  const [safeKind, setSafeKind] = useState(kindProp)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needed to allow fading out
    if (kindProp) setSafeKind(kindProp)
  }, [kindProp])

  // Allows fade out animation if hidden is enabled and kind changed to undefined
  const kind = kindProp ?? safeKind

  return (
    <span
      className={cn(
        alertBadge({ kind, hidden: hidden ?? kindProp == null, ...props })
      )}
    />
  )
}
