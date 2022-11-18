import React from "react"
import { ScrollView, View, Text, Switch, Platform, Button } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import * as Feature from "./feature"
// TODO json imports seem to be broken
// import versionJson from "../.version.json"

export default function Component(props) {
  const [storage, setStorage] = React.useState(null)
  const [dump, setDump] = React.useState(false)
  // console.log(versionJson)
  React.useEffect(() => {
    if (dump && storage === null) {
      ;(async () => {
        const keys = await AsyncStorage.getAllKeys()
        const state = await AsyncStorage.multiGet(keys)
        setStorage(state)
      })()
    }
  })
  return Pure({
    ...React.useContext(Feature.Context),
    // version: versionJson,
    storage,
    dump,
    setDump,
  })
}

export function Pure({
  // version,
  feature,
  updateFeature,
  storage,
  dump,
  setDump,
}) {
  const items = [
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
    ...(dump ? storage || [] : []).map(([key, val]: [string, string]) => [
      'AsyncStorage["' + key + '"]: \n' + val,
    ]),
  ]
  return (
    <ScrollView>
      <Text style={{ fontSize: 24, borderBottomWidth: 1 }}>Debug</Text>
      <View>{items.map(renderEntry)}</View>
    </ScrollView>
  )
}
Component.Pure = Pure

function renderEntry([key, val], i) {
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
