interface DayMeta {
  isFiller: boolean
  isToday: boolean
}

export class Day {
  public readonly date: Temporal.PlainDate
  public readonly meta: DayMeta = { isFiller: false, isToday: false }

  constructor(...args: [Temporal.PlainDate] | [number, number, number]) {
    this.date =
      args[0] instanceof Temporal.PlainDate
        ? Temporal.PlainDate.from(args[0])
        : new Temporal.PlainDate(...(args as [number, number, number]))

    this.meta.isToday = this.date.equals(Temporal.Now.plainDateISO())
  }

  public toString() {
    return this.date.toString()
  }

  public getRelative(dayOffset: number): Day {
    const duration = new Temporal.Duration(0, 0, 0, dayOffset)
    return new Day(this.date.add(duration))
  }

  public getWeekStart() {
    if (this.date.dayOfWeek === 1) return this
    return this.getRelative(-1 * (this.date.dayOfWeek - 1))
  }
  public getWeekEnd() {
    if (this.date.dayOfWeek === 7) return this
    return this.getRelative(this.date.dayOfWeek - 1)
  }
}
