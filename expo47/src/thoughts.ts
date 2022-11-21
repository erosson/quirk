import * as Distortion from "./distortions"
import * as D from "./json-decode"
import uuidv4 from "uuid/v4"
import { QueryArgs } from "@testing-library/react"

const CURRENT_VERSION = 1
export interface Thought {
  v: typeof CURRENT_VERSION
  automaticThought: string
  alternativeThought: string
  cognitiveDistortions: Set<Distortion.Distortion>
  challenge: string
  createdAt: Date
  updatedAt: Date
  uuid: ThoughtID
}
export type ThoughtID = string

// old-style thoughts. These are persisted in user data, so we must maintain decode support forever
export interface LegacyThoughtV0 {
  automaticThought: string
  alternativeThought: string
  cognitiveDistortions: Distortion.LegacyDistortionV0[]
  challenge: string
  createdAt: Date
  updatedAt: Date
  uuid: string
}

export interface CreateArgs {
  automaticThought: string
  alternativeThought: string
  cognitiveDistortions: Distortion.Distortion[] | Set<Distortion.Distortion>
  challenge: string
}
export const THOUGHTS_KEY_PREFIX = `@Quirk:thoughts:`
export function getThoughtKey(info): string {
  return `${THOUGHTS_KEY_PREFIX}${info}`
}

export function create(args: CreateArgs): Thought {
  return {
    ...args,
    cognitiveDistortions: new Set(args.cognitiveDistortions),
    uuid: getThoughtKey(uuidv4()),
    createdAt: new Date(),
    updatedAt: new Date(),
    v: CURRENT_VERSION,
  }
}

/**
 * Transform a `Thought` to JSON.
 *
 * Based on Elm's `JSON.Encode` and `JSON.Decode`.
 */
export function encode(t: Thought): object
export function encode(t: Thought, mode: "default"): object
export function encode(t: Thought, mode: "legacy"): object
export function encode(
  t: Thought,
  mode: "legacy" | "default" = "default"
): object {
  switch (mode) {
    case "legacy":
      return {
        ...toLegacyV0(t),
        createdAt: t.createdAt.getTime(),
        updatedAt: t.updatedAt.getTime(),
      }
    default:
      return {
        ...t,
        createdAt: t.createdAt.getTime(),
        updatedAt: t.updatedAt.getTime(),
        cognitiveDistortions: Array.from(t.cognitiveDistortions).map((d) =>
          Distortion.encode(d)
        ),
      }
  }
}

/**
 * Parse and validate a `Thought` from JSON.
 *
 * All invalid input will throw an error; output will always be a valid `Distortion`.
 *
 * Based on Elm's `JSON.Encode` and `JSON.Decode`.
 */
export function decode(enc: object): Thought {
  try {
    D.object(enc)
    let v: unknown = enc["v"]
    switch (v) {
      case 1:
        // modern thought
        return {
          automaticThought: D.string(enc["automaticThought"]),
          alternativeThought: D.string(enc["alternativeThought"]),
          cognitiveDistortions: new Set(
            D.array(enc["cognitiveDistortions"], Distortion.decode)
          ),
          challenge: D.string(enc["challenge"]),
          uuid: D.string(enc["uuid"]),
          v,
          createdAt: D.date(enc["createdAt"]),
          updatedAt: D.date(enc["updatedAt"]),
        }
      default:
        // legacy thought
        return {
          automaticThought: D.string(enc["automaticThought"]),
          alternativeThought: D.string(enc["alternativeThought"]),
          cognitiveDistortions: new Set(
            D.array(enc["cognitiveDistortions"], Distortion.decode)
          ),
          challenge: D.string(enc["challenge"]),
          uuid: D.string(enc["uuid"]),
          v: CURRENT_VERSION,
          createdAt: D.date(enc["createdAt"]),
          updatedAt: D.date(enc["updatedAt"]),
        }
    }
  } catch (e) {
    throw new Error(`couldn't decode thought: ${JSON.stringify(enc)}`, {
      cause: e,
    })
  }
}

function toLegacyV0(t: Thought): LegacyThoughtV0 {
  return {
    ...t,
    cognitiveDistortions: Array.from(t.cognitiveDistortions).map(
      Distortion.toLegacyV0
    ),
  }
}

export interface ThoughtGroup {
  date: string
  thoughts: Thought[]
}

export function groupThoughtsByDay(thoughts: Thought[]): ThoughtGroup[] {
  const dates: string[] = []
  const groups: ThoughtGroup[] = []

  const sortedThoughts = thoughts.sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  )

  for (const thought of sortedThoughts) {
    const date = new Date(thought.createdAt).toDateString()
    if (!dates.includes(date)) {
      dates.push(date)
      groups.push({
        date,
        thoughts: [thought],
      })
      continue
    }

    groups[dates.length - 1].thoughts.push(thought)
  }

  return groups
}
