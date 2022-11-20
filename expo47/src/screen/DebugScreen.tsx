import React from "react"
import { ScrollView, View, Text, Switch, Platform, Button } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import * as Feature from "../feature"
import { useAsyncState, withDefault } from "../async-state"
import { Screen, ScreenProps } from "../screens"
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types"
// TODO json imports seem to be broken
// import versionJson from "../.version.json"

type Props = ScreenProps<Screen.DEBUG>

const constItems = [
  ["Release channel", Constants.manifest.releaseChannel || "(dev)"],
  ["Expo version", Constants.expoVersion],
  ["App version", Constants.manifest.version],
  ["Revision", Constants.manifest.revisionId || "(dev)"],
  // ["Revision Git", version.hash],
  // ["Revision Date", version.date],
  // ["Revision Timestamp", version.timestamp + ""],
  [
    "Test exception reporting",
    <Button
      title="Oops"
      onPress={() => {
        throw new Error("oops")
      }}
    />,
  ],
  [
    "Test console.error reporting",
    <Button
      title="Oops"
      onPress={() => {
        console.error("oops")
      }}
    />,
  ],
  [
    "Test console.warn reporting",
    <Button
      title="Oops"
      onPress={() => {
        console.warn("oops")
      }}
    />,
  ],
  ["OS", Platform.OS],
]
export default function DebugScreen(props: Props): JSX.Element {
  const storage = useAsyncState<readonly KeyValuePair[]>(async () => {
    const keys = await AsyncStorage.getAllKeys()
    return await AsyncStorage.multiGet(keys)
  })
  const [dump, setDump] = React.useState<boolean>(false)
  const { feature, updateFeature } = React.useContext(Feature.Context)

  const items = [
    ...constItems,
    ...Object.entries(feature)
      // @ts-ignore: sort features by name. I promise key in [key, value] is a string
      .sort((a, b) => a[0] > b[0])
      .map(([key, val]: [string, boolean]) => [
        key,
        <Switch
          value={val}
          onValueChange={() => updateFeature({ [key]: !val })}
        />,
      ]),
    [
      "Dump AsyncStorage?",
      <Switch value={dump} onValueChange={() => setDump(!dump)} />,
    ],
    ...(dump ? withDefault(storage, []) : []).map(
      ([key, val]: [string, string]) => [
        'AsyncStorage["' + key + '"]: \n' + val,
      ]
    ),
  ]
  return (
    <ScrollView>
      <Text style={{ fontSize: 24, borderBottomWidth: 1 }}>Debug</Text>
      <View>{items.map(renderEntry)}</View>
    </ScrollView>
  )
}

function renderEntry([key, val], i): JSX.Element {
  if (typeof val === "string") {
    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
        }}
      >
        <Text>{key}: </Text>
        <Text style={{ alignSelf: "flex-end" }}>{val}</Text>
      </View>
    )
  } else if (React.isValidElement(val)) {
    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
        }}
      >
        <Text>{key}: </Text>
        <View>{val}</View>
      </View>
    )
  } else {
    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
        }}
      >
        <Text>{key}</Text>
      </View>
    )
  }
}
