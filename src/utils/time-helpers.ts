const twoDigit = (value: number) =>
  Math.round(value).toString().padStart(2, "0").slice(0, 2)

const getNumbers = (value = "") => value.replaceAll(/[^\d]+/g, "")

export interface ParsedTime {
  hours: number
  minutes: number
}
const timeToParsed = (value: string): ParsedTime => {
  const numbers = getNumbers(value)
  return {
    hours: Number(numbers.slice(0, 2)),
    minutes: Number(numbers.slice(2, 4)),
  }
}

const timeFromParsed = (time: ParsedTime) =>
  `${twoDigit(time.hours)}:${twoDigit(time.minutes)}`

const timeToMinutes = (time: string) => {
  const { hours, minutes } = timeToParsed(time)
  return hours * 60 + minutes
}

const timeFromMinutes = (minutesDiff: number) => {
  const minutes = minutesDiff % 60
  const hours = (minutesDiff - minutes) / 60
  return timeFromParsed({ hours, minutes })
}

export const timeHelpers = {
  toMinutes: timeToMinutes,
  fromMinutes: timeFromMinutes,
  toParsed: timeToParsed,
  fromParsed: timeFromParsed,
}
