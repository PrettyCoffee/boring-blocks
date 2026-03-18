import { ReactNode } from "react"

import { createSlice } from "@yaasl/react"

import { AlertKind } from "../../../types/alert"
import { ButtonProps } from "../button"

const defaultDurations: Record<AlertKind, number> = {
  info: 5000,
  success: 5000,
  warn: 0,
  error: 0,
}

export interface ToastAction extends Pick<
  ButtonProps,
  "look" | "onClick" | "icon" | "href"
> {
  label: string
}

export interface ToastProps {
  kind: AlertKind
  title: string
  message?: ReactNode
  duration?: number
  actions?: ToastAction[]
}

export interface ToastDataProps extends ToastProps {
  id: string
}

type ToastPatch = Partial<Omit<ToastProps, "id">>

export const toastList = createSlice({
  name: "toast-list",
  defaultValue: [] as ToastDataProps[],
  reducers: {
    add: (state, toast: ToastDataProps) => [toast, ...state],
    edit: (state, id: string, data: ToastPatch) =>
      state.map(toast => (toast.id !== id ? toast : { ...toast, ...data, id })),
    close: (state, id: string) => state.filter(toast => toast.id !== id),
    clear: () => [],
  },
})

let lastId = 0
export const showToast = ({
  kind,
  duration = defaultDurations[kind],
  ...props
}: ToastProps) => {
  const id = String(++lastId)
  toastList.actions.add({ ...props, id, kind, duration })

  return {
    close: () => toastList.actions.close(id),
    edit: (data: ToastPatch) => toastList.actions.edit(id, data),
  }
}
