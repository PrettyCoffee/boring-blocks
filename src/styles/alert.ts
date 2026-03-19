import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  BadgeX,
  LucideIcon,
} from "../components/icons"
import { AlertKind } from "../types/alert"

interface AlertStyle {
  icon: LucideIcon
  border: string
  borderGentle: string
  bg: string
}

export const alert: Record<AlertKind, AlertStyle> = {
  info: {
    icon: BadgeInfo,
    bg: "bg-alert-info",
    border: "border-alert-info",
    borderGentle: "border-alert-info/25",
  },
  success: {
    icon: BadgeCheck,
    bg: "bg-alert-success",
    border: "border-alert-success",
    borderGentle: "border-alert-success/25",
  },
  warn: {
    icon: BadgeAlert,
    bg: "bg-alert-warn",
    border: "border-alert-warn",
    borderGentle: "border-alert-warn/25",
  },
  error: {
    icon: BadgeX,
    bg: "bg-alert-error",
    border: "border-alert-error",
    borderGentle: "border-alert-error/25",
  },
}
