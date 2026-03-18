export type AlertKind = "info" | "success" | "warn" | "error"

export interface Alert {
  kind: AlertKind
  text: string
}
