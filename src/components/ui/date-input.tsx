import { type Dispatch, useState } from "react"

import { CalendarDaysIcon } from "../icons"
import { Button } from "./button"
import { Calendar, type CalendarProps } from "./calendar"
import { Popover } from "./popover"

const printDate = (date: Temporal.PlainDate) => {
  if (date.equals(Temporal.Now.plainDateISO())) return "Today"
  return date.toLocaleString("en-US", {
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
    <Popover.Root open={open} onOpenChange={setOpen} placement="bottom">
      <Popover.Trigger>
        <Button
          icon={CalendarDaysIcon}
          iconColor="muted"
          className="border border-stroke-gentle"
        >
          {caption || printDate(value)}
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
  )
}
