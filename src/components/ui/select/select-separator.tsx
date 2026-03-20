import { Select as Primitive } from "@base-ui/react/select"

import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"

export namespace SelectSeparator {
  export type Props = ClassNameProp
}
export const SelectSeparator = ({ className }: SelectSeparator.Props) => (
  <Primitive.Separator
    className={cn("pointer-events-none m-1 h-px bg-stroke-gentle", className)}
  />
)
