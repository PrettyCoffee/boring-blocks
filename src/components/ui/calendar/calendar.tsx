import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from "react"

import { hstack, vstack } from "../../../styles/stack"
import { cn } from "../../../utils/cn"
import { ChevronLeft, ChevronRight } from "../../icons"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import { focusManager } from "./utils/focus-manager"
import { Month } from "./utils/month"
import { ErrorBoundary } from "../../utility/error-boundary"

const getMonthName = (month: Month) =>
  month.firstDay.date.toLocaleString("en-US", { month: "long" })

const GridHeaderCell = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      hstack({ align: "center", justify: "center" }),
      "size-8 text-text-gentle"
    )}
  >
    {children}
  </div>
)

const GridHeader = () => (
  <>
    <GridHeaderCell>M</GridHeaderCell>
    <GridHeaderCell>T</GridHeaderCell>
    <GridHeaderCell>W</GridHeaderCell>
    <GridHeaderCell>T</GridHeaderCell>
    <GridHeaderCell>F</GridHeaderCell>
    <GridHeaderCell>S</GridHeaderCell>
    <GridHeaderCell>S</GridHeaderCell>
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

  const magnitudeCaptions = {
    month: { next: "Next month", prev: "Previous month" },
    year: { next: "Next year", prev: "Previous year" },
  }[magnitude]

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
            <span className="text-text-priority">{getMonthName(month)}</span>
            <span className="mr-1">,</span>
            {month.month.year}
          </>
        ) : (
          <>
            {getMonthName(month)}
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
        title={magnitudeCaptions.prev}
        onClick={() => setMonth(prev)}
        disabled={prevDisabled}
      />
      <IconButton
        size="sm"
        icon={ChevronRight}
        hideTitle
        title={magnitudeCaptions.next}
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
