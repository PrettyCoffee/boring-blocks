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
  borderGentle: string
  bg: string
}

export const alert: Record<AlertKind, AlertStyle> = {
  info: {
    icon: BadgeInfoIcon,
    bg: "bg-alert-info",
    border: "border-alert-info",
    borderGentle: "border-alert-info/25",
  },
  success: {
    icon: BadgeCheckIcon,
    bg: "bg-alert-success",
    border: "border-alert-success",
    borderGentle: "border-alert-success/25",
  },
  warn: {
    icon: BadgeAlertIcon,
    bg: "bg-alert-warn",
    border: "border-alert-warn",
    borderGentle: "border-alert-warn/25",
  },
  error: {
    icon: BadgeXIcon,
    bg: "bg-alert-error",
    border: "border-alert-error",
    borderGentle: "border-alert-error/25",
  },
}
