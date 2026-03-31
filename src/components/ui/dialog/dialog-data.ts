import { type ReactNode } from "react"

import { createAtom } from "@yaasl/react"

import { type DialogProps } from "./dialog"

interface DialogState {
  title: DialogProps["title"]
  description?: DialogProps["description"]
  content?: ReactNode
  confirm?: NonNullable<DialogProps["confirm"]>
  cancel?: DialogProps["cancel"]
}

export const dialogState = createAtom<DialogState | null>({
  name: "dialog-state",
  defaultValue: null,
})

export const showDialog = (dialog: DialogState) => {
  dialogState.set({
    ...dialog,
    confirm: {
      ...dialog.confirm,
      onClick: () => dialog.confirm?.onClick?.(),
    },
    cancel: {
      ...dialog.cancel,
      onClick: () => dialog.cancel?.onClick?.(),
    },
  })
}
