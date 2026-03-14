import { PropsWithChildren } from "react"

import { Tooltip } from "./tooltip"
import { TooltipPlacement } from "./use-tooltip"
import { ClassNameProp, TitleProp } from "../../../types/base-props"

export interface TitleTooltipProps extends TitleProp, ClassNameProp {
  side?: Extract<
    TooltipPlacement,
    "cursor" | "top" | "bottom" | "left" | "right"
  >
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
    <Tooltip className={className} trigger={children} placement={side}>
      {title}
    </Tooltip>
  )
