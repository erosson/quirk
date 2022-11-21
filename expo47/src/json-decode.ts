/**
 * Given some JSON with an expected format, parse the JSON into correctly-typed Typescript objects, validating as we go.
 *
 * JSON decoding should always throw an error if the Typescript value would be invalid (ie. not match its type).
 * That way, we can trust Typescript types throughout the rest of our program.
 *
 * Based on Elm's JSON encoders and decoders. (An encoding module didn't feel necessary for Typescript.)
 *
 * TODO: there must be some existing library for this...
 */

/**
 * Decode a string
 */
export function string(v: any): string {
  if (typeof v === "string") {
    return v
  }
  throw new Error(`not a string: ${v}`)
}
export function number(v: any): number {
  if (typeof v === "number") {
    return v
  }
  throw new Error(`not a number: ${v}`)
}
export function boolean(v: any): boolean {
  if (typeof v === "boolean") {
    return v
  }
  throw new Error(`not a boolean: ${v}`)
}
export function object(v: any): object {
  if (typeof v === "object" && v != null) {
    return v
  }
  throw new Error(`not an object: ${v}`)
}
export function array<V>(v: any, child: (any) => V): V[] {
  if (Array.isArray(v)) {
    return v.map((c) => child(c))
  }
  throw new Error(`not an array: ${v}`)
}
export function dict<V>(v: any, child: (any) => V): { [k: string]: V }
export function dict<V>(v: any, child: (any, string) => V): { [k: string]: V }
export function dict<V>(v: any, child: any): { [k: string]: V } {
  if (typeof v === "object") {
    const entries: [string, unknown][] = Object.entries(v)
    const mapped: [string, V][] = entries.map(([k, c]) => child(c, k))
    return Object.fromEntries(mapped)
  }
  throw new Error(`not an object: ${v}`)
}
export function date(v: any): Date {
  return new Date(number(v))
}

export function field(v: any, key: any): any {
  if (key in v) {
    return v[key]
  }
  throw new Error(`no such key: ${key}`)
}

export function at(v: any, keys: any[]): any {
  for (let key of keys) {
    v = field(v, key)
  }
  return v
}
