import React from "react"
import {
  TouchableOpacity,
  ScrollView,
  StatusBar,
  View,
  Image,
} from "react-native"
import { getExercises, deleteExercise } from "../thoughtstore"
import { Header, Row, Container, IconButton, Label, Paragraph } from "../ui"
import theme from "../theme"
import { Screen, ScreenProps } from "../screens"
import { SavedThought, ThoughtGroup, groupThoughtsByDay } from "../thoughts"
import universalHaptic from "../haptic"
import Constants from "expo-constants"
import * as Haptic from "expo-haptics"
import { validThoughtGroup } from "../sanitize"
import Alerter from "../alerter"
import alerts from "../alerts"
import {
  HistoryButtonLabelSetting,
  getHistoryButtonLabel,
} from "./SettingsScreen"
import i18n from "../i18n"
import { emojiForSlug } from "../distortions"
import { take } from "lodash"
import { FadesIn } from "../animations"
import { useAsyncEffect } from "../util"

const ThoughtItem = ({
  thought,
  historyButtonLabel,
  onPress,
  onDelete,
}: {
  thought: SavedThought
  historyButtonLabel: HistoryButtonLabelSetting
  onPress: (thought: SavedThought | boolean) => void
  onDelete: (thought: SavedThought) => void
}) => (
  <Row style={{ marginBottom: 18 }}>
    <TouchableOpacity
      onPress={() => onPress(thought)}
      style={{
        backgroundColor: "white",
        borderColor: theme.lightGray,
        borderBottomWidth: 2,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 18,
        flex: 1,
      }}
    >
      <Paragraph
        style={{
          color: theme.darkText,
          fontWeight: "400",
          fontSize: 16,
          marginBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 12,
          paddingBottom: 6,
        }}
      >
        {historyButtonLabel === "alternative-thought"
          ? thought.alternativeThought
          : thought.automaticThought}
      </Paragraph>

      <View
        style={{
          backgroundColor: theme.lightOffwhite,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 12,
          paddingTop: 6,
          margin: 4,
          borderRadius: 8,
        }}
      >
        <Paragraph>
          {take(
            thought.cognitiveDistortions
              .filter((n) => n) // Filters out any nulls or undefineds which can crop up
              .filter((distortion) => distortion.selected)
              .map((dist) => emojiForSlug(dist.slug)),
            8 // only take a max of 8
          )
            .filter((n) => n)
            .join(" ")
            .trim()}
        </Paragraph>
      </View>
    </TouchableOpacity>

    <IconButton
      style={{
        alignSelf: "flex-start",
      }}
      accessibilityLabel={i18n.t("accessibility.delete_thought_button")}
      featherIconName={"trash"}
      onPress={() => onDelete(thought)}
    />
  </Row>
)

const EmptyThoughtIllustration = () => (
  <View
    style={{
      alignItems: "center",
      marginTop: 36,
    }}
  >
    <Image
      source={require("../../assets/looker/Looker.png")}
      style={{
        width: 200,
        height: 150,
        alignSelf: "center",
        marginBottom: 32,
      }}
    />
    <Label marginBottom={18} textAlign={"center"}>
      {i18n.t("cbt_list.empty")}
    </Label>
  </View>
)

interface ThoughtListProps {
  groups: ThoughtGroup[]
  historyButtonLabel: HistoryButtonLabelSetting
  navigateToViewer: (thought: SavedThought) => void
  onItemDelete: (thought: SavedThought) => void
}

const ThoughtItemList = ({
  groups,
  navigateToViewer,
  onItemDelete,
  historyButtonLabel,
}: ThoughtListProps) => {
  if (!groups || groups.length === 0) {
    return <EmptyThoughtIllustration />
  }

  const items = groups.map((group) => {
    const thoughts = group.thoughts.map((thought) => (
      <ThoughtItem
        key={thought.uuid}
        thought={thought}
        onPress={navigateToViewer}
        onDelete={onItemDelete}
        historyButtonLabel={historyButtonLabel}
      />
    ))

    const isToday =
      new Date(group.date).toDateString() === new Date().toDateString()

    return (
      <View key={group.date} style={{ marginBottom: 18 }}>
        <Label>{isToday ? i18n.t("cbt_list.today") : group.date}</Label>
        {thoughts}
      </View>
    )
  })

  return <>{items}</>
}

type Props = ScreenProps<Screen.CBT_LIST>

interface State {
  groups: ThoughtGroup[]
  historyButtonLabel: HistoryButtonLabelSetting
  isReady: boolean
}

function fixTimestamps(json): SavedThought {
  const createdAt: Date = new Date(json.createdAt)
  const updatedAt: Date = new Date(json.updatedAt)
  return {
    createdAt,
    updatedAt,
    ...json,
  }
}

export default function CBTListScreen({ navigation }: Props): JSX.Element {
  const [groups, setGroups] = React.useState<ThoughtGroup[]>([])
  const [historyButtonLabel, setHistoryButtonLabel] = React.useState<HistoryButtonLabelSetting>("alternative-thought")
  const [isReady, setIsReady] = React.useState<boolean>(false)

  useAsyncEffect(async () => {
    try {
      const [label, exercises] = await Promise.all([getHistoryButtonLabel(), getExercises()])
      setHistoryButtonLabel(label)
      const thoughts: SavedThought[] = exercises
        .map(([_, value]) => JSON.parse(value))
        .filter((n) => n) // Worst case scenario, if bad data gets in we don't show it.
        .map(fixTimestamps)
      const groups: ThoughtGroup[] =
        groupThoughtsByDay(thoughts).filter(validThoughtGroup)
      setGroups(groups)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsReady(true)
    }
  })

  return (
    <View style={{ backgroundColor: theme.lightOffwhite }}>
      <ScrollView
        style={{
          backgroundColor: theme.lightOffwhite,
          marginTop: Constants.statusBarHeight,
          paddingTop: 24,
          height: "100%",
        }}
      >
        <Container>
          <StatusBar barStyle="dark-content" />
          <Row style={{ marginBottom: 18 }}>
            <Header allowFontScaling={false}>
              {i18n.t("cbt_list.header")}
            </Header>

            <View style={{ flexDirection: "row" }}>
              <IconButton
                featherIconName={"settings"}
                onPress={() => navigation.push(Screen.SETTING)}
                accessibilityLabel={i18n.t("accessibility.settings_button")}
                style={{ marginRight: 18 }}
              />
              <IconButton
                featherIconName={"x"}
                onPress={() => {
                  universalHaptic.impact(Haptic.ImpactFeedbackStyle.Light)
                  navigation.push(Screen.CBT_FORM, { clear: true })
                }}
                accessibilityLabel={i18n.t(
                  "accessibility.new_thought_button"
                )}
              />
            </View>
          </Row>

          <FadesIn pose={isReady ? "visible" : "hidden"}>
            <ThoughtItemList
              groups={groups}
              navigateToViewer={(thought: SavedThought) => {
                navigation.push(Screen.FINISHED_THOUGHT, {
                  thought,
                })
              }}
              onItemDelete={async (thought: SavedThought) => {
                universalHaptic.notification(Haptic.NotificationFeedbackType.Success)
                await deleteExercise(thought.uuid)
                // triggers reload
                setIsReady(false)
              }}
              historyButtonLabel={historyButtonLabel}
            />
          </FadesIn>
        </Container>
      </ScrollView>
      <Alerter alerts={alerts} />
    </View>
  )
}