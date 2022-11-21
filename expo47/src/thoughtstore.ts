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
  const raw = await AsyncStorage.getItem(id)
  const enc = JSON.parse(raw)
  return T.decode(enc)
}

export async function remove(uuid: string) {
  try {
    await AsyncStorage.removeItem(uuid)
  } catch (error) {
    console.error(error)
  }
}

export async function getExercises(): Promise<AsyncState.Result<T.Thought>[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((key) =>
    key.startsWith(T.THOUGHTS_KEY_PREFIX)
  )

  let rows = await AsyncStorage.multiGet(keys)
  return rows.map(([key, raw]: [string, string]) => {
    return AsyncState.tryResult(() => {
      const enc = JSON.parse(raw)
      return T.decode(enc)
    })
  })
}

export const countThoughts = async (): Promise<number> => {
  const exercises = await getExercises()
  return exercises.length
}
