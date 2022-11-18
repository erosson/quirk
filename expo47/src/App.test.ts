import "../App"

test("App was successfully imported", () => {
  expect(1).toBe(1)
})
test("Storybook doesn't break promise.finally: #19", () => {
  // See https://github.com/erosson/freecbt/issues/19
  // I don't think this is bulletproof: tests have different build steps than
  // the app, and https://github.com/storybookjs/react-native/issues/20 seems to
  // describe this as a build problem. fix seems to work for both tests and prod
  // though!
  expect(Promise.prototype.finally).toBeTruthy()
})
