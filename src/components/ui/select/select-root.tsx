import { type PropsWithChildren, type ReactNode } from "react"

import { Select as Primitive } from "@base-ui/react/select"

import { surface } from "../../../styles/surface"
import { zIndex } from "../../../styles/z-index"
import { type ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { ChevronDownIcon, ChevronUpIcon } from "../../icons"
import { Button } from "../button"
import { Icon } from "../icon"
import { SelectOption } from "./select-option"
import { SelectSeparator } from "./select-separator"

const maxWidth = cn("max-w-80")

interface TriggerProps extends ClassNameProp {
  placeholder: string
  caption?: ReactNode
}
const Trigger = ({ placeholder, caption, className }: TriggerProps) => (
  <Primitive.Trigger
    render={
      <Button
        className={cn(
          maxWidth,
          "justify-between gap-2 truncate border border-stroke-muted data-placeholder:text-text-muted",
          "[&_svg]:transition [&_svg]:duration-400 [&_svg]:ease-bounce data-[state='open']:[&_svg]:rotate-180",
          className
        )}
      >
        <Primitive.Value placeholder={placeholder} className="truncate">
          {caption}
        </Primitive.Value>
        <Primitive.Icon
          render={<Icon icon={ChevronDownIcon} size="sm" color="gentle" />}
        ></Primitive.Icon>
      </Button>
    }
  />
)

const ScrollButton = ({ side, ...props }: { side: "top" | "bottom" }) => (
  <div
    {...props}
    className={cn(
      "absolute inset-x-0 z-1 h-6 cursor-default p-1 hover:[&_svg]:text-highlight",
      side === "top" ? "top-0" : "bottom-0"
    )}
  >
    <div
      className={cn(
        surface({ look: "overlay" }),
        "grid size-full place-content-center rounded-md [*:hover>&]:bgl-layer/10"
      )}
    >
      <Icon icon={side === "top" ? ChevronUpIcon : ChevronDownIcon} size="sm" />
    </div>
  </div>
)

const ScrollUpButton = () => (
  <Primitive.ScrollUpArrow render={<ScrollButton side="top" />} />
)

const ScrollDownButton = () => (
  <Primitive.ScrollDownArrow render={<ScrollButton side="bottom" />} />
)

interface ContentProps {
  alignItemWithTrigger?: boolean
}
const Content = ({
  children,
  alignItemWithTrigger,
}: PropsWithChildren<ContentProps>) => (
  <Primitive.Portal>
    <Primitive.Positioner
      side="bottom"
      sideOffset={4}
      align="start"
      alignItemWithTrigger={alignItemWithTrigger}
      className={cn(zIndex.popover, "isolate")}
    >
      <Primitive.Popup
        className={cn(
          surface({ look: "overlay", size: "lg" }),
          maxWidth,
          "relative isolate max-h-(--available-height) min-w-[max(32px,var(--anchor-width))] origin-(--transform-origin) overflow-x-hidden overflow-y-auto p-0",
          "duration-100 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        <ScrollUpButton />
        <Primitive.List
          className={cn(
            "p-1",
            "h-(--radix-select-trigger-height) w-full scroll-my-1"
          )}
        >
          {children}
        </Primitive.List>
        <ScrollDownButton />
      </Primitive.Popup>
    </Primitive.Positioner>
  </Primitive.Portal>
)

const ClearOption = ({ caption }: { caption: string }) => (
  <>
    <SelectOption value={null}>
      <span className="text-text-muted">{caption}</span>
    </SelectOption>
    <SelectSeparator />
  </>
)

export namespace SelectRoot {
  export type ChangeEventDetails = Primitive.Root.ChangeEventDetails
  export type ChangeHandler = (
    value: string | null,
    eventDetails: ChangeEventDetails
  ) => void

  export interface Props extends ContentProps, TriggerProps {
    value?: string | null
    onChange: ChangeHandler
    clearOption?: boolean
  }
}

export const SelectRoot = ({
  value,
  onChange,
  alignItemWithTrigger,
  caption,
  placeholder,
  clearOption,
  children,
  className,
}: PropsWithChildren<SelectRoot.Props>) => (
  <Primitive.Root<string> value={value} onValueChange={onChange}>
    <Trigger
      caption={caption}
      placeholder={placeholder}
      className={className}
    />
    <Content alignItemWithTrigger={alignItemWithTrigger}>
      {clearOption && <ClearOption caption={placeholder} />}
      {children}
    </Content>
  </Primitive.Root>
)
SelectRoot.displayName = "Select.Root"
