import i18n from "./i18n"
import { Platform } from "react-native"
import * as _ from "lodash"
import * as J from "@erosson/json-encode-decode"
import { data } from "./data/distortions.json"
import * as Schema from "@freecbt/schema"

type DistortionID = string

export class Distortion {
  constructor(public data: Schema.Distortion) {}

  get slug(): string {
    return this.data.slug
  }
  get labelKey(): string {
    return this.data.labelKey ?? _.snakeCase(this.slug)
  }
  get descriptionKey(): string {
    return this.data.descriptionKey ?? `${_.snakeCase(this.slug)}_one_liner`
  }
  label(): string {
    return i18n.t(this.labelKey)
  }
  description(): string {
    return i18n.t(this.descriptionKey)
  }
  emoji(): string {
    const [first, fallback] = this.data.emoji
    if (fallback == null) {
      return first
    }
    // I'm not saying iOS is better, but wider support for emojis is reaaallll nice
    if (Platform.OS === "ios") {
      return first
    }

    // update your phones people
    if ((Platform.Version as number) <= 23) {
      return fallback
    }

    return first
  }
}
export type T = Distortion

// old-style distortions. These are persisted in user data, so we must maintain decode support forever
export type LegacyDistortionV0 = {
  emoji?: string
  label: string
  slug: string
  selected?: boolean
  description: string
}

/**
 * Transform a `Thought` to JSON.
 *
 * Based on Elm's `JSON.Encode` and `JSON.Decode`.
 */
export function encode(d: Distortion): DistortionID
export function encode(d: Distortion, mode: "default"): DistortionID
export function encode(d: Distortion, mode: "legacy"): LegacyDistortionV0
export function encode(
  d: Distortion,
  // we must maintain legacy decode support forever, because such data already exists.
  // let's support legacy encodes as well, for testing and debugging tools
  mode: "legacy" | "default" = "default"
): DistortionID | LegacyDistortionV0 {
  switch (mode) {
    case "legacy":
      return toLegacyV0(d)
    default:
      return d.slug
  }
}

/**
 * Parse and validate a `Distortion` from JSON.
 */
export const decoder: J.Decoder<Distortion> = J.oneOf(
  J.string.field("slug"),
  J.string
).andThen((id) =>
  id in bySlug ? J.succeed(bySlug[id]) : J.fail(`no such distortion id: ${id}`)
)

export function toLegacyV0(d: Distortion): LegacyDistortionV0 {
  return {
    slug: d.slug,
    emoji: d.emoji(),
    label: d.label(),
    description: d.description(),
  }
}

export const list: Distortion[] = data.map((d) => new Distortion(d))
export function sortedList(): Distortion[] {
  return _.sortBy(list, (d) => d.label().toUpperCase())
}
export const bySlug: { [slug: string]: Distortion } = _.keyBy(
  list,
  (d) => d.slug
)

export function legacyDistortions(): LegacyDistortionV0[] {
  return sortedList().map(toLegacyV0)
}

export const emojiForSlug = (slug: string): string => {
  return bySlug[slug] ? bySlug[slug].emoji() : "🤷‍"
}
