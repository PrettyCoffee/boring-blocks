import { type Dispatch, type SetStateAction, useState } from "react"

import { msg } from "@lingui/core/macro"

import { useLanguage, useTrans } from "../../../locales"
import { hstack, vstack } from "../../../styles/stack"
import { cn } from "../../../utils/cn"
import { ChevronLeft, ChevronRight } from "../../icons"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import { focusManager } from "./utils/focus-manager"
import { Month } from "./utils/month"
import { ErrorBoundary } from "../../utility/error-boundary"

const MonthName = ({ month }: { month: Month }) => {
  const language = useLanguage()
  const monthName = month.firstDay.date.toLocaleString(language, {
    month: "long",
  })
  return <>{monthName}</>
}

const GridHeaderCell = ({ weekday }: { weekday: number }) => {
  const language = useLanguage()

  const today = Temporal.Now.plainDateISO()
  const day = today.add({ days: (weekday - today.dayOfWeek + 7) % 7 })
  const dayName = day.toLocaleString(language, { weekday: "long" })[0] ?? ""

  return (
    <div
      className={cn(
        hstack({ align: "center", justify: "center" }),
        "size-8 text-text-gentle"
      )}
    >
      {dayName}
    </div>
  )
}

const GridHeader = () => (
  <>
    <GridHeaderCell weekday={1} />
    <GridHeaderCell weekday={2} />
    <GridHeaderCell weekday={3} />
    <GridHeaderCell weekday={4} />
    <GridHeaderCell weekday={5} />
    <GridHeaderCell weekday={6} />
    <GridHeaderCell weekday={7} />
  </>
)

interface GridBodyProps {
  month: Month
  selected?: Temporal.PlainDate
  onSelectionChange?: Dispatch<Temporal.PlainDate>
  isDisabled: (day: Temporal.PlainDate) => boolean
}
const GridBody = ({
  month,
  selected,
  onSelectionChange,
  isDisabled,
}: GridBodyProps) => (
  <>
    {month.days.map(day => (
      <Button
        key={day.toString()}
        size="sm"
        onClick={() => onSelectionChange?.(day.date)}
        disabled={isDisabled(day.date)}
        className={cn(
          "p-0",
          selected?.equals(day.date) && "border border-stroke-focus",
          day.meta.isFiller && "text-text-muted",
          day.meta.isToday && "text-highlight"
        )}
      >
        {day.date.day}
      </Button>
    ))}
  </>
)

const clampMonth = (value: Month, min: Month, max: Month) => {
  if (value.valueOf() < min.valueOf()) return min
  if (value.valueOf() > max.valueOf()) return max
  return value
}

const magnitudeCaptions = {
  month: {
    next: msg`Next month`,
    prev: msg`Previous month`,
  },
  year: {
    next: msg`Next year`,
    prev: msg`Previous year`,
  },
}

interface ViewSwitchProps {
  month: Month
  min: Temporal.PlainDate
  max: Temporal.PlainDate
  setMonth: Dispatch<SetStateAction<Month>>
}
const ViewSwitch = ({ month, min, max, setMonth }: ViewSwitchProps) => {
  const [magnitude, setMagnitude] = useState<"month" | "year">("month")

  const minMonth = Month.fromDate(min)
  const maxMonth = Month.fromDate(max)

  const monthDiff = magnitude === "month" ? 1 : 12
  const prev = clampMonth(month.getRelative(-1 * monthDiff), minMonth, maxMonth)
  const next = clampMonth(month.getRelative(monthDiff), minMonth, maxMonth)

  const prevDisabled = month.valueOf() <= minMonth.valueOf()
  const nextDisabled = month.valueOf() >= maxMonth.valueOf()

  const nextCaption = useTrans(magnitudeCaptions[magnitude].next)
  const prevCaption = useTrans(magnitudeCaptions[magnitude].prev)

  return (
    <div className="flex">
      <Button
        size="sm"
        className="text-text-gentle"
        onClick={() =>
          setMagnitude(prev => (prev === "month" ? "year" : "month"))
        }
      >
        {magnitude === "month" ? (
          <>
            <span className="text-text-priority">
              <MonthName month={month} />
            </span>
            <span className="mr-1">,</span>
            {month.month.year}
          </>
        ) : (
          <>
            <MonthName month={month} />
            <span className="mr-1">,</span>
            <span className="text-text-priority">{month.month.year}</span>
          </>
        )}
      </Button>

      <span className="flex-1" />

      <IconButton
        size="sm"
        icon={ChevronLeft}
        hideTitle
        title={prevCaption}
        onClick={() => setMonth(prev)}
        disabled={prevDisabled}
      />
      <IconButton
        size="sm"
        icon={ChevronRight}
        hideTitle
        title={nextCaption}
        onClick={() => setMonth(next)}
        disabled={nextDisabled}
      />
    </div>
  )
}

export interface CalendarProps {
  initialView?: Temporal.PlainDate
  selected?: Temporal.PlainDate
  onSelectionChange?: Dispatch<Temporal.PlainDate>
  min?: Temporal.PlainDate
  max?: Temporal.PlainDate
}

export const Calendar = ({
  initialView = Temporal.Now.plainDateISO(),
  selected,
  onSelectionChange,
  max = Temporal.PlainDate.from("2069-12-31"),
  min = Temporal.PlainDate.from("1970-01-01"),
}: CalendarProps) => {
  const [month, setMonth] = useState(() => Month.fromDate(initialView))

  const isDisabled = (day: Temporal.PlainDate) =>
    Temporal.PlainDate.compare(day, min) === -1 ||
    Temporal.PlainDate.compare(day, max) === 1

  return (
    <ErrorBoundary>
      <div className={cn(vstack({ inline: true }))}>
        <ViewSwitch month={month} max={max} min={min} setMonth={setMonth} />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions
          -- event bubbles up to this element */}
        <div className="inline-grid grid-cols-7" onKeyDown={focusManager}>
          <GridHeader />
          <GridBody
            month={month}
            selected={selected}
            onSelectionChange={onSelectionChange}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
