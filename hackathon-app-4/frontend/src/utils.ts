export type Success<T> = { data: T, err: null }
export type Err = {
  data: null, err: {
    msg: string
  }
}

export type EmptyObj = Record<string, never>

export function isErr<T>(d: Success<T> | Err): d is Err {
  return d.err !== null
}