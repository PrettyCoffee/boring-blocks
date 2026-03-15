import { PropsWithChildren } from "react"

import { Placement } from "@floating-ui/react"

import { Tooltip } from "./tooltip"
import { ClassNameProp } from "../../../types/base-props"

export interface TitleTooltipProps extends ClassNameProp {
  /** Title tooltip to briefly describe the element / an action */
  title?: string
  /** Position of the title tooltip. Will follow the cursor by default. */
  side?: Extract<Placement, "top" | "bottom" | "left" | "right">
}
export const TitleTooltip = ({
  title,
  side,
  children,
  className,
}: PropsWithChildren<TitleTooltipProps>) =>
  !title ? (
    children
  ) : (
    <Tooltip
      className={className}
      trigger={children}
      placement={side ?? "cursor"}
    >
      {title}
    </Tooltip>
  )
