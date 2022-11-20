import React from "react"

export type AsyncState<V> = () => Promise<V>
export type AsyncStateOpts<V> = {
  effect: AsyncState<V>
  cleanup?: () => void
  deps?: React.DependencyList
}

export type Init = { status: "init" }
export type Pending = { status: "pending"; promise: Promise<void> }
/**
 * Typescript exceptions are `any`, so unlike functional languages, failures are not typed.
 */
export type Failure = { status: "failure"; error: any }
export type Success<V> = { status: "success"; value: V }

/**
 * Asynchronously loaded data. Based on the Elm version:
 * https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/RemoteData
 */
export type RemoteData<V> = Init | Pending | Result<V>

/**
 * The result of a computation that may fail. Either a value or an exception.
 */
export type Result<V> = Failure | Success<V>

export function isInit<V>(d: RemoteData<V>): d is Init {
  return d.status === "init"
}
export function isPending<V>(d: RemoteData<V>): d is Pending {
  return d.status === "pending"
}
export function isFailure<V>(d: RemoteData<V> | Result<V>): d is Failure {
  return d.status === "failure"
}
export function isSuccess<V>(d: RemoteData<V> | Result<V>): d is Success<V> {
  return d.status === "success"
}
export function isResult<V>(d: RemoteData<V>): boolean {
  return isFailure(d) || isSuccess(d)
}
export function withDefault<V>(d: RemoteData<V> | Result<V>, default_: V): V {
  return isSuccess(d) ? d.value : default_
}
export function map<V, T>(
  d: RemoteData<V> | Result<V>,
  fn: (v: V) => T
): RemoteData<T> {
  return isSuccess(d) ? { status: "success", value: fn(d.value) } : d
}
export function fold<V, T>(
  d: RemoteData<V>,
  initFn: () => T,
  pendingFn: (p: Promise<void>) => T,
  failureFn: (e: any) => T,
  successFn: (v: V) => T
): T
export function fold<V, T>(
  d: Result<V>,
  failureFn: (e: any) => T,
  successFn: (v: V) => T
): T
export function fold<V, T>(
  d: any,
  arg1: any,
  arg2: any,
  arg3?: any,
  arg4?: any
): T {
  if (arg3) {
    // remotedata
    switch (d.status) {
      case "init":
        return arg1()
      case "pending":
        return arg2(d.promise)
      case "failure":
        return arg3(d.error)
      case "success":
        return arg4(d.value)
      default:
        throw new Error(`bad RemoteData: ${d}`)
    }
  } else {
    // result
    switch (d.status) {
      case "failure":
        return arg1(d.error)
      case "success":
        return arg2(d.value)
      default:
        throw new Error(`bad Result: ${d}`)
    }
  }
}

/**
 * Load some data asynchronously.
 *
 * `useEffect` loads the data, and `useState` stores it as `RemoteData`.
 */
export function useAsyncState<V>(
  effect: AsyncState<V>,
  deps?: React.DependencyList
): RemoteData<V>
export function useAsyncState<V>(opts: AsyncStateOpts<V>): RemoteData<V>
export function useAsyncState<V>(
  arg1: AsyncStateOpts<V> | AsyncState<V>,
  arg2?: React.DependencyList
): RemoteData<V> {
  const opts: AsyncStateOpts<V> =
    typeof arg1 === "function" ? { effect: arg1, deps: arg2 } : arg1

  const [state, setState] = React.useState<RemoteData<V>>({ status: "init" })
  React.useEffect(() => {
    setState({
      status: "pending",
      // There are two different promises here!
      // * opts.effect() returns a `Promise<V>`, which might `reject()`.
      // * The promise below, exposed by useAsyncState, returns a `Promise<void>`
      // that returns at the same time as the original, but will never reject.
      // It returns no data. Useful for unit tests, but React components
      // shouldn't rely on it.
      promise: new Promise<void>((resolve) => {
        opts
          .effect()
          .then((value) => {
            setState({ status: "success", value })
            resolve()
          })
          .catch((error) => {
            setState({ status: "failure", error })
            resolve()
          })
      }),
    })
    return opts.cleanup
  }, opts.deps ?? [])
  return state
}

export type AsyncEffect = AsyncState<void>
export type AsyncEffectOpts = AsyncStateOpts<void>
export type AsyncEffectResult = RemoteData<void>

/**
 * `useEffect` for asynchronous computations.
 */
export function useAsyncEffect(
  effect: AsyncEffect,
  deps?: React.DependencyList
): AsyncEffectResult
export function useAsyncEffect(opts: AsyncEffectOpts): AsyncEffectResult
export function useAsyncEffect(
  arg1: AsyncEffectOpts | AsyncEffect,
  arg2?: React.DependencyList
): AsyncEffectResult {
  return typeof arg1 === "function"
    ? useAsyncState(arg1, arg2)
    : useAsyncState(arg1)
}
