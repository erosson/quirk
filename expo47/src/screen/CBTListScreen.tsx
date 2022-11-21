import React from "react"
import {
  TouchableOpacity,
  ScrollView,
  StatusBar,
  View,
  Image,
} from "react-native"
import * as ThoughtStore from "../thoughtstore"
import { Header, Row, Container, IconButton, Label, Paragraph } from "../ui"
import theme from "../theme"
import { Screen, ScreenProps } from "../screens"
import * as Thought from "../thoughts"
import universalHaptic from "../haptic"
import Constants from "expo-constants"
import * as Haptic from "expo-haptics"
import Alerter from "../alerter"
import alerts from "../alerts"
import {
  HistoryButtonLabelSetting,
  getHistoryButtonLabel,
} from "./SettingsScreen"
import i18n from "../i18n"
import { take } from "lodash"
import { FadesIn } from "../animations"
import * as AsyncState from "../async-state"

const ThoughtItem = ({
  thought,
  historyButtonLabel,
  onPress,
  onDelete,
}: {
  thought: Thought.T
  historyButtonLabel: HistoryButtonLabelSetting
  onPress: (thought: Thought.T) => void
  onDelete: (thought: Thought.T) => void
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
            Array.from(thought.cognitiveDistortions).map((d) => d.emoji()),
            8
          )
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
  groups: Thought.ThoughtGroup[]
  historyButtonLabel: HistoryButtonLabelSetting
  navigateToViewer: (thought: Thought.T) => void
  onItemDelete: (thought: Thought.T) => void
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

export default function CBTListScreen({ navigation }: Props): JSX.Element {
  const [reload, setReload] = React.useState(0)
  const historyButtonLabel = AsyncState.useAsyncState(getHistoryButtonLabel)
  const thoughtRes = AsyncState.useAsyncState<
    AsyncState.Result<Thought.T, ThoughtStore.ParseError>[]
  >(ThoughtStore.getExercises, [reload])
  const groups: AsyncState.RemoteData<Thought.ThoughtGroup[]> = AsyncState.map(
    thoughtRes,
    (rs) => {
      const ts: Thought.T[] = rs
        .filter(AsyncState.isSuccess)
        .map((r) => r.value)
      return Thought.groupThoughtsByDay(ts)
    }
  )
  const errors: AsyncState.RemoteData<ThoughtStore.ParseError[]> =
    AsyncState.map(thoughtRes, (rs) =>
      rs.filter(AsyncState.isFailure).map((f) => f.error)
    )

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
                  navigation.push(Screen.CBT_FORM, {})
                }}
                accessibilityLabel={i18n.t("accessibility.new_thought_button")}
              />
            </View>
          </Row>

          <FadesIn pose={AsyncState.isResult(groups) ? "visible" : "hidden"}>
            {AsyncState.fold(
              groups,
              () => null,
              () => null,
              (error) => (
                <Paragraph>{JSON.stringify(error)}</Paragraph>
              ),
              (gs) => (
                <ThoughtItemList
                  groups={gs}
                  navigateToViewer={(thought: Thought.T) => {
                    navigation.push(Screen.CBT_VIEW, {
                      thoughtID: thought.uuid,
                    })
                  }}
                  onItemDelete={async (thought: Thought.T) => {
                    universalHaptic.notification(
                      Haptic.NotificationFeedbackType.Success
                    )
                    await ThoughtStore.remove(thought.uuid)
                    setReload(reload + 1)
                  }}
                  historyButtonLabel={AsyncState.withDefault(
                    historyButtonLabel,
                    "alternative-thought"
                  )}
                />
              )
            )}
          </FadesIn>
        </Container>
      </ScrollView>
      <Alerter alerts={alerts} />
    </View>
  )
}
