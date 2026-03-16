export type Merge<T, U> = {[P in Exclude<keyof T, keyof U>]: T[P]} & U;
