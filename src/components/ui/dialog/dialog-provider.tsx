import { useEffect } from "react"

import { useAtom } from "@yaasl/react"

import { Dialog } from "./dialog"
import { dialogState } from "./dialog-data"

export const DialogProvider = () => {
  const dialog = useAtom(dialogState)
  useEffect(
    () => () => {
      dialogState.set(null)
    },
    []
  )
  return !dialog ? null : (
    <Dialog {...dialog} onClose={() => dialogState.set(null)}>
      {dialog.content}
    </Dialog>
  )
}
