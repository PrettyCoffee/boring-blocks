type Indexable = Record<string, unknown>

type Resolve<T> = {
  [K in keyof T]: T[K]
} & {}

type Loose<T> = Resolve<Exclude<T, undefined>>

export type ObjDeepPath<TObj> = TObj extends Indexable
  ? {
      [K in keyof Loose<TObj>]: Loose<TObj>[K] extends Indexable
        ? `${Exclude<K, symbol>}.${ObjDeepPath<Loose<TObj>[K]>}`
        : Exclude<K, symbol>
    }[keyof Loose<TObj>]
  : never

export type ObjDeepValue<TObj, TPath> = TObj extends Indexable
  ? TPath extends `${infer Current}.${infer Next}`
    ? ObjDeepValue<TObj[Current], Next>
    : TObj[TPath & string]
  : never

export type FlatObject<T> = {
  [K in ObjDeepPath<T>]: ObjDeepValue<T, K>
}

export const flatten = <T extends object>(obj: T): FlatObject<T> => {
  const result = {} as FlatObject<T>

  const setItem = (keys: string, value: unknown) => {
    const key = keys as ObjDeepPath<T>
    result[key] = value as ObjDeepValue<T, typeof key>
  }

  Object.entries(obj).forEach(([baseKey, value]) => {
    if (!value) return
    if (typeof value !== "object") {
      setItem(baseKey, value)
    }
    if (typeof value === "object") {
      const flat = flatten(value)
      Object.entries(flat).forEach(([innerKey, value]) => {
        setItem(`${baseKey}.${innerKey}`, value)
      })
    }
  })

  return result
}
