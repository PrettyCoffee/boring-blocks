import { type Dispatch, useState } from "react"

import { msg } from "@lingui/core/macro"

import { CalendarDaysIcon } from "../icons"
import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { Popover } from "./popover"
import { i18n, useLocale } from "../../locales"
import { type ClassNameProp } from "../../types/base-props"
import { cn } from "../../utils/cn"
import { ErrorBoundary } from "../utility/error-boundary"

const DateValue = ({ date }: { date: Temporal.PlainDate }) => {
  const locale = useLocale()

  if (date.equals(Temporal.Now.plainDateISO())) return i18n._(msg`Today`)
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export interface DateInputProps
  extends ClassNameProp, Pick<CalendarProps, "min" | "max"> {
  caption?: string
  value?: Temporal.PlainDate
  onChange?: Dispatch<Temporal.PlainDate>
}

export const DateInput = ({
  value = Temporal.Now.plainDateISO(),
  onChange,
  caption,
  min,
  max,
  className,
  ...props
}: DateInputProps) => {
  const [open, setOpen] = useState(false)
  return (
    <ErrorBoundary>
      <Popover.Root open={open} onOpenChange={setOpen} placement="bottom">
        <Popover.Trigger>
          <Button
            {...props}
            icon={CalendarDaysIcon}
            iconColor="muted"
            className={cn("border border-stroke-gentle", className)}
          >
            {caption || <DateValue date={value} />}
          </Button>
        </Popover.Trigger>

        <Popover.Content>
          <Calendar
            selected={value}
            initialView={value}
            min={min}
            max={max}
            onSelectionChange={value => {
              onChange?.(value)
              setOpen(false)
            }}
          />
        </Popover.Content>
      </Popover.Root>
    </ErrorBoundary>
  )
}
