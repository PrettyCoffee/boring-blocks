import { type PropsWithChildren } from "react"

import { surface } from "../../styles/surface"
import { zIndex } from "../../styles/z-index"
import { type ClassNameProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { PopoverPrimitive } from "../primitive/popover-primitive"

const PopoverRoot = (props: PropsWithChildren<Popover.Root.Props>) => (
  <PopoverPrimitive.Root placement="bottom" {...props} />
)

const PopoverTrigger = (props: PropsWithChildren) => (
  <PopoverPrimitive.Trigger {...props} />
)

const PopoverContent = ({
  className,
  children,
}: PropsWithChildren<ClassNameProp>) => (
  <PopoverPrimitive.Content
    outerClassName={zIndex.popover}
    innerClassName={cn(surface({ look: "overlay", size: "md" }), className)}
  >
    {children}
  </PopoverPrimitive.Content>
)

export namespace Popover {
  export namespace Root {
    export type Props = Partial<PopoverPrimitive.Options>
  }
  export namespace Content {
    export type Props = ClassNameProp
  }
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverPrimitive.Close,
}
