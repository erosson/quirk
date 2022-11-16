// app.json for storybook - apparently js instead of json is allowed
import appJson from "./app.json"
export default {
  ...appJson.expo,
  name: "FreeCBT Storybook",
  android: {
    ...appJson.expo.android,
    package: "org.erosson.freecbt.storybook",
  },
  androidNavigationBar: {
    visible: "immersive",
  },
}
