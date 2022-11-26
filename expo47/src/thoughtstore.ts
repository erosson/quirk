import AsyncStorage from "@react-native-async-storage/async-storage"
import * as AsyncState from "./async-state"
import * as T from "./thoughts"

const EXISTING_USER_KEY = "@Quirk:existing-user"

export async function exists(key: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key)
    return !!value
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getIsExistingUser(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(EXISTING_USER_KEY)
    return !!value
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function setIsExistingUser() {
  try {
    await AsyncStorage.setItem(EXISTING_USER_KEY, "true")
  } catch (err) {
    console.error(err)
  }
}

export async function write(t: T.Thought): Promise<void> {
  const enc = T.encode(t)
  const raw = JSON.stringify(enc)
  await AsyncStorage.setItem(t.uuid, raw)
}

export async function read(id: T.ThoughtID): Promise<T.Thought> {
  return parseOrThrow((await AsyncStorage.getItem(id)) ?? "")
}
export async function readResult(
  id: T.ThoughtID
): Promise<AsyncState.Result<T.Thought, ParseError>> {
  return parseResult((await AsyncStorage.getItem(id)) ?? "", id)
}

export interface ParseError {
  error: any
  raw: string
  id: T.ThoughtID
}
function parseOrThrow(raw: string): T.Thought {
  const enc = JSON.parse(raw)
  return T.decoder.decodeValue(enc)
}
function parseResult(
  raw: string,
  id: T.ThoughtID
): AsyncState.Result<T.Thought, ParseError> {
  return AsyncState.mapError(
    AsyncState.tryResult(() => parseOrThrow(raw)),
    (error) => ({ error, raw, id })
  )
}

export async function remove(uuid: T.ThoughtID) {
  try {
    await AsyncStorage.removeItem(uuid)
  } catch (error) {
    console.error(error)
  }
}

export async function getExercises(): Promise<
  AsyncState.Result<T.Thought, ParseError>[]
> {
  const keys = (await AsyncStorage.getAllKeys()).filter((key) =>
    key.startsWith(T.THOUGHTS_KEY_PREFIX)
  )

  let rows = await AsyncStorage.multiGet(keys)
  return rows.map(([key, raw]: [string, string | null]) =>
    parseResult(raw ?? "", key)
  )
}

export const countThoughts = async (): Promise<number> => {
  const exercises = await getExercises()
  return exercises.length
}
