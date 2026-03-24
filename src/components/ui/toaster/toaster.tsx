import { useAtom } from "@yaasl/react"

import { Toast } from "./toast"
import { toastList } from "./toaster-data"
import { zIndex } from "../../../styles/z-index"
import { cn } from "../../../utils/cn"
import { ErrorBoundary } from "../../utility/error-boundary"
import { Portal } from "../../utility/portal"

export const Toaster = () => {
  const toasts = useAtom(toastList)

  return (
    <ErrorBoundary>
      <Portal>
        <div
          className={cn(
            "fixed right-0 bottom-0 flex flex-col p-2",
            zIndex.toast
          )}
        >
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={toastList.actions.close}
            />
          ))}
        </div>
      </Portal>
    </ErrorBoundary>
  )
}
