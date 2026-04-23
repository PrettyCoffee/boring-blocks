import { Select as Primitive } from "@base-ui/react/select"

import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { ErrorBoundary } from "../../utility/error-boundary"

export namespace SelectSeparator {
  export type Props = ClassNameProp
}
export const SelectSeparator = ({ className }: SelectSeparator.Props) => (
  <ErrorBoundary>
    <Primitive.Separator
      className={cn("pointer-events-none m-1 h-px bg-stroke-muted", className)}
    />
  </ErrorBoundary>
)
SelectSeparator.displayName = "Select.Separator"
