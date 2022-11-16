import React from "react";
import { storiesOf } from "@storybook/react-native";
import DebugScreen from "./DebugScreen";
import * as Feature from "./feature";

storiesOf("DebugScreen", module).add("default view", () => (
  <DebugScreen.Pure
    version={{
      timestamp: 1591172459,
      date: "Wed, 03 Jun 2020 04:20:59 -0400",
      hash: "2.2.0-51-g22c6ffd-dirty",
    }}
    feature={Feature.defaults}
    dump={false}
    async_={[["key", "val"]]}
    updateFeature={() => null}
    setDump={() => null}
    setAsync={() => null}
  />
));
