import * as AJV from "ajv"
import * as Model from "@freecbt/schema"
import schema from "@freecbt/schema/dist/FreeCBT.schema.json"
import distortionSchema from "@freecbt/schema/dist/Distortion.schema.json"

test("load ts schema", () => {
  const tid: Model.ThoughtID = ""
  // pass if it typechecked
})
test("load json schema", () => {
  expect(schema).toBeTruthy()
})
test("ajv validates some data, with a programmatic def", () => {
  // https://ajv.js.org/guide/getting-started.html
  const ajv = new AJV.default({ schemas: [schema] })
  const validator = ajv.compile<Model.Distortion>({
    $ref: `${schema.$id}#/definitions/Distortion`,
  })
  verify(validator)
})
test("ajv validates some data, with a generated def", () => {
  // https://ajv.js.org/guide/getting-started.html
  // const ajv = new AJV.default({ schemas: [schema] })
  const ajv = new AJV.default({ schemas: { "FreeCBT.schema.json": schema } })
  const validator = ajv.compile<Model.Distortion>(distortionSchema)
  verify(validator)
})

function verify(validator: AJV.ValidateFunction<unknown>) {
  expect(validator.errors).toBeFalsy()

  // try some validation errors
  expect(validator({})).toBeFalsy()
  expect(validator.errors).toBeTruthy()

  expect(validator({ slug: "all-or-nothing" })).toBeFalsy()
  expect(validator.errors).toBeTruthy()

  expect(
    validator({ slug: "all-or-nothing", emoji: ["💩", "💩", "💩"] })
  ).toBeFalsy()
  expect(validator.errors).toBeTruthy()

  // finally, success. resets the `errors` prop too
  expect(validator({ slug: "all-or-nothing", emoji: ["💩"] })).toBeTruthy()
  expect(validator.errors).toBeFalsy()
}
