import { type HTMLProps } from "react"

import { alert as alertStyles } from "../../../styles/alert"
import { type AlertKind } from "../../../types/alert"
import { Icon } from "../icon"
import { TitleTooltip } from "../tooltip"

export interface InputAlert {
  kind: AlertKind
  text: string
}

type SpanProps = HTMLProps<HTMLSpanElement>
interface InputAlertIconProps extends Pick<
  SpanProps,
  "ref" | "style" | "className"
> {
  alert: InputAlert
}
export const InputAlertIcon = ({ alert, ...props }: InputAlertIconProps) => (
  <TitleTooltip title={alert.text}>
    <span {...props} className="grid size-10 shrink-0 place-content-center">
      <Icon icon={alertStyles[alert.kind].icon} color={alert.kind} size="sm" />
    </span>
  </TitleTooltip>
)
