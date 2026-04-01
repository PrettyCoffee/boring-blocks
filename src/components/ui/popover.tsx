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
    duration={150}
    className={cn(
      zIndex.popover,
      "*:duration-150 *:fill-mode-forwards",
      "data-close:*:animate-out data-close:*:fade-out-0 data-close:*:zoom-out-95 data-open:*:animate-in data-open:*:fade-in-0 data-open:*:zoom-in-95",
      "data-[side=bottom]:*:slide-in-from-top-4 data-[side=left]:*:slide-in-from-right-4 data-[side=right]:*:slide-in-from-left-4 data-[side=top]:*:slide-in-from-bottom-4"
    )}
  >
    <div className={cn(surface({ look: "overlay", size: "md" }), className)}>
      {children}
    </div>
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
