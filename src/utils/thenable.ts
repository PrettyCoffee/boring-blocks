const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  !!value &&
  typeof value === "object" &&
  "then" in value &&
  typeof value.then === "function"

export function thenable<TValue>(value: TValue): PromiseLike<TValue>
export function thenable<TValue = void>(value?: undefined): PromiseLike<TValue>

export function thenable<TValue>(value: TValue) {
  const toThenable = <T>(value: T | PromiseLike<T>): PromiseLike<T> =>
    isPromiseLike(value) ? value : thenable(value)

  const then = <TFulfilled = TValue, TRejected = never>(
    onfulfilled?:
      | ((value: TValue) => TFulfilled | PromiseLike<TFulfilled>)
      | null,
    onrejected?: ((reason: any) => TRejected | PromiseLike<TRejected>) | null
  ): PromiseLike<TFulfilled | TRejected> => {
    try {
      if (!onfulfilled) return toThenable(value as unknown as TFulfilled)
      return toThenable(onfulfilled(value))
    } catch (error) {
      if (!onrejected) throw error
      return toThenable(onrejected(error))
    }
  }

  return { then }
}
