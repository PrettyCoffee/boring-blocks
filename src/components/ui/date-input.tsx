import { type Dispatch, useState } from "react"

import { msg } from "@lingui/core/macro"

import { CalendarDaysIcon } from "../icons"
import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { Popover } from "./popover"
import { useLocale, useTrans } from "../../locales"
import { ErrorBoundary } from "../utility/error-boundary"

const DateValue = ({ date }: { date: Temporal.PlainDate }) => {
  const trans = useTrans()
  const locale = useLocale()

  if (date.equals(Temporal.Now.plainDateISO())) return trans._(msg`Today`)
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export interface DateInputProps extends Pick<CalendarProps, "min" | "max"> {
  caption?: string
  value?: Temporal.PlainDate
  onChange?: Dispatch<Temporal.PlainDate>
}

export const DateInput = ({
  value = Temporal.Now.plainDateISO(),
  onChange,
  caption,
  ...props
}: DateInputProps) => {
  const [open, setOpen] = useState(false)
  return (
    <ErrorBoundary>
      <Popover.Root open={open} onOpenChange={setOpen} placement="bottom">
        <Popover.Trigger>
          <Button
            icon={CalendarDaysIcon}
            iconColor="muted"
            className="border border-stroke-gentle"
          >
            {caption || <DateValue date={value} />}
          </Button>
        </Popover.Trigger>

        <Popover.Content>
          <Calendar
            selected={value}
            initialView={value}
            onSelectionChange={value => {
              onChange?.(value)
              setOpen(false)
            }}
            {...props}
          />
        </Popover.Content>
      </Popover.Root>
    </ErrorBoundary>
  )
}
