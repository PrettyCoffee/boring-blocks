export type Resolve<T extends object> = { [K in keyof T]: T[K] } & {}
