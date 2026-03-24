import {
  BadgeAlertIcon,
  BadgeCheckIcon,
  BadgeInfoIcon,
  BadgeXIcon,
  type LucideIcon,
} from "../components/icons"
import { type AlertKind } from "../types/alert"

interface AlertStyle {
  icon: LucideIcon
  border: string
  outline: string
  bg: string
}

export const alert: Record<AlertKind, AlertStyle> = {
  info: {
    icon: BadgeInfoIcon,
    bg: "bg-alert-info",
    border: "border-alert-info",
    outline: "outline-alert-info/25",
  },
  success: {
    icon: BadgeCheckIcon,
    bg: "bg-alert-success",
    border: "border-alert-success",
    outline: "outline-alert-success/25",
  },
  warn: {
    icon: BadgeAlertIcon,
    bg: "bg-alert-warn",
    border: "border-alert-warn",
    outline: "outline-alert-warn/25",
  },
  error: {
    icon: BadgeXIcon,
    bg: "bg-alert-error",
    border: "border-alert-error",
    outline: "outline-alert-error/25",
  },
}
