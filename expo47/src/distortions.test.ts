import * as D from "./distortions"

test("sorted", () => {
  expect(D.sortedList().map((d) => d.slug)).toEqual([
    "all-or-nothing",
    "catastrophizing",
    "emotional-reasoning",
    "fortune-telling",
    "labeling",
    "magnification-of-the-negative",
    "mind-reading",
    "minimization-of-the-positive",
    "other-blaming",
    "overgeneralization",
    "self-blaming",
    "should-statements",
  ])
  expect(D.legacyDistortions().map((d) => d.slug)).toEqual(
    D.sortedList().map((d) => d.slug)
  )
})

test("encode and decode", () => {
  const d: D.Distortion = D.bySlug["all-or-nothing"]
  expect(d).toBeTruthy()
  expect(d.slug).toBe("all-or-nothing")
  const enc: string = D.encode(d)
  const d2: D.Distortion = D.decoder.decodeValue(enc)
  expect(typeof enc).toBe("string")
  expect(d2).toBe(d)
})

test("legacy encode and decode", () => {
  const d: D.Distortion = D.bySlug["all-or-nothing"]
  expect(d).toBeTruthy()
  expect(d.slug).toBe("all-or-nothing")
  const enc: D.LegacyDistortionV0 = D.encode(d, "legacy")
  const d2: D.Distortion = D.decoder.decodeValue(enc as any)
  expect(typeof enc).toBe("object")
  expect(d2).toBe(d)
})

test("legacy decode", () => {
  const enc: D.LegacyDistortionV0 = {
    slug: "all-or-nothing",
    emoji: "💩",
    label: "whatever",
    description: "blah",
  }
  const d2: D.Distortion = D.decoder.decodeValue(enc as any)
  expect(d2).toBe(D.bySlug["all-or-nothing"])
})

test("decode failure", () => {
  expect(() => D.decoder.decodeValue(3 as any)).toThrow("Expecting a STRING")
  expect(() => D.decoder.decodeValue(null as any)).toThrow("Expecting a STRING")
  expect(() => D.decoder.decodeValue("LOL")).toThrow("no such distortion")
  const enc: D.LegacyDistortionV0 = {
    slug: "LOL-or-nothing",
    emoji: "💩",
    label: "whatever",
    description: "blah",
  }
  expect(() => D.decoder.decodeValue(enc as any)).toThrow("no such distortion")
})
