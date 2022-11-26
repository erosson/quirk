import i18n from "./i18n"
import { Platform } from "react-native"
import * as _ from "lodash"
import * as J from "@erosson/json-encode-decode"

type DistortionID = string

export type Distortion = {
  emoji: () => string
  label: () => string
  slug: string
  description: () => string
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

const emj = (first: string, fallback: string) => {
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

export const list: Distortion[] = [
  {
    slug: "all-or-nothing",
    emoji: () => "🌓",
    label: () => i18n.t("all_or_nothing_thinking"),
    description: () => i18n.t("all_or_nothing_thinking_one_liner"),
  },
  {
    slug: "overgeneralization",
    emoji: () => "👯‍",
    label: () => i18n.t("over_generalization"),
    description: () => i18n.t("overgeneralization_one_liner"),
  },
  {
    slug: "mind-reading",
    emoji: () => emj("🧠", "💭"),
    label: () => i18n.t("mind_reading"),
    description: () => i18n.t("mind_reading_one_liner"),
  },
  {
    slug: "fortune-telling",
    emoji: () => "🔮",
    label: () => i18n.t("fortune_telling"),
    description: () => i18n.t("fortune_telling_one_liner"),
  },
  {
    slug: "magnification-of-the-negative",
    emoji: () => "👎",
    label: () => i18n.t("magnification_of_the_negative"),
    description: () => i18n.t("magnification_of_the_negative_one_liner"),
  },
  {
    slug: "minimization-of-the-positive",
    emoji: () => "👍",
    label: () => i18n.t("minimization_of_the_positive"),
    description: () => i18n.t("minimization_of_the_positive_one_liner"),
  },
  {
    slug: "catastrophizing",
    emoji: () => emj("🤯", "💥"),
    label: () => i18n.t("catastrophizing"),
    description: () => i18n.t("catastrophizing_one_liner"),
  },
  {
    slug: "emotional-reasoning",
    emoji: () => "🎭",
    label: () => i18n.t("emotional_reasoning"),
    description: () => i18n.t("emotional_reasoning_one_liner"),
  },
  {
    slug: "should-statements",
    emoji: () => "✨",
    label: () => i18n.t("should_statements"),
    description: () => i18n.t("should_statements_one_liner"),
  },
  {
    slug: "labeling",
    // ya know, because onigiri has like a little seaweed label.
    // Trust me it makese sense
    emoji: () => emj("🏷", "🍙"),
    label: () => i18n.t("labeling"),
    description: () => i18n.t("labeling_one_liner"),
  },
  {
    slug: "self-blaming",
    // look man don't ask me why it's a no-pedestrian as a fallback
    // update your phones people
    emoji: () => emj("👁", "🚷"),
    label: () => i18n.t("self_blaming"),
    description: () => i18n.t("self_blaming_one_liner"),
  },
  {
    slug: "other-blaming",
    emoji: () => emj("🧛‍", "👺"),
    label: () => i18n.t("other_blaming"),
    description: () => i18n.t("other_blaming_one_liner"),
  },
]
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
