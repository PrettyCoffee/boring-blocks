import { Day } from "./day"

const getMonthStart = (month: Temporal.PlainYearMonth) => {
  const start = new Day(month.year, month.month, 1).getWeekStart()
  if (start.date.month !== month.month) start.meta.isFiller = true
  return start
}

const getMonthDays = (month: Temporal.PlainYearMonth) => {
  const days: Day[] = [getMonthStart(month)]
  let prev = days[0]!
  let next = days[0]!

  while (days.length < 42) {
    prev = next
    next = prev.getRelative(1)
    if (next.date.month !== month.month) next.meta.isFiller = true
    days.push(next)
  }

  return days
}

export class Month {
  public readonly month: Temporal.PlainYearMonth
  public readonly days: Day[]

  public readonly firstDay: Day
  public readonly lastDay: Day

  constructor(...args: [Temporal.PlainYearMonth] | [number, number]) {
    this.month =
      args[0] instanceof Temporal.PlainYearMonth
        ? Temporal.PlainYearMonth.from(args[0])
        : new Temporal.PlainYearMonth(...(args as [number, number]))

    this.days = getMonthDays(this.month)

    this.firstDay = new Day(this.month.toPlainDate({ day: 1 }))
    this.lastDay = new Day(
      this.month.toPlainDate({ day: this.month.daysInMonth })
    )
  }

  public getRelative(offset: number) {
    const duration = new Temporal.Duration(0, offset)
    return new Month(this.month.add(duration))
  }

  public valueOf() {
    return this.month.year * 12 + this.month.month
  }

  static fromDate(date: Temporal.PlainDate) {
    return new Month(date.year, date.month)
  }
}
