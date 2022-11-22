import React from "react"
import {
  SubHeader,
  Paragraph,
  Header,
  IconButton,
  ActionButton,
  GhostButton,
} from "../ui"
import { ScrollView, View, Linking } from "react-native"
import Constants from "expo-constants"
import * as Haptic from "expo-haptics"
import theme from "../theme"
import { Screen, ScreenProps } from "../screens"
import i18n from "../i18n"
import { BubbleThought } from "../imgs/Bubbles"
import haptic from "../haptic"

type Props = ScreenProps<Screen.EXPLANATION>

const Distortion = ({ children }: { children: any }) => (
  <View
    style={{
      marginBottom: 48,
    }}
  >
    {children}
  </View>
)

const AllOrNothingThinking = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("all_or_nothing_thinking")} {"🌓"}
    </SubHeader>

    <Paragraph>{i18n.t("all_or_nothing_thinking_explanation")}</Paragraph>

    <BubbleThought>{i18n.t("all_or_nothing_thinking_thought")}</BubbleThought>
  </Distortion>
)

const Catastrophizing = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("catastrophizing")} {"🤯"}
    </SubHeader>

    <Paragraph>{i18n.t("catastrophizing_explanation")}</Paragraph>

    <BubbleThought color="purple">
      {i18n.t("catastrophizing_thought")}
    </BubbleThought>
  </Distortion>
)

const EmotionalReasoning = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("emotional_reasoning")} {"🎭"}
    </SubHeader>

    <Paragraph>
      {i18n.t("emotional_reasoning_explanation_1")} {"\n"}
    </Paragraph>

    <Paragraph>{i18n.t("emotional_reasoning_explanation_2")}</Paragraph>

    <BubbleThought color="pink">
      {i18n.t("emotional_reasoning_thought")}
    </BubbleThought>
  </Distortion>
)

const FortuneTelling = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("fortune_telling")} {"🔮"}
    </SubHeader>

    <Paragraph>{i18n.t("fortune_telling_explanation")}</Paragraph>

    <BubbleThought color="purple">
      {i18n.t("fortune_telling_thought")}
    </BubbleThought>
  </Distortion>
)

const Labeling = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("labeling")} {"🏷"}
    </SubHeader>

    <Paragraph>{i18n.t("labeling_explanation")}</Paragraph>

    <BubbleThought>{i18n.t("labeling_thought")}</BubbleThought>
  </Distortion>
)

const MagnificationOfTheNegative = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("magnification_of_the_negative")} {"👎"}
    </SubHeader>

    <Paragraph>{i18n.t("magnification_of_the_negative_explanation")}</Paragraph>

    <BubbleThought>
      {i18n.t("magnification_of_the_negative_thought")}
    </BubbleThought>
  </Distortion>
)

const MindReading = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("mind_reading")} {"🧠"}
    </SubHeader>

    <Paragraph>{i18n.t("mind_reading_explanation")}</Paragraph>

    <BubbleThought color="pink">{i18n.t("mind_reading_thought")}</BubbleThought>
  </Distortion>
)

const MimizationOfThePositive = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("minimization_of_the_positive")} {"👍"}
    </SubHeader>

    <Paragraph>{i18n.t("minimization_of_the_positive_explanation")}</Paragraph>

    <BubbleThought>
      {i18n.t("minimization_of_the_positive_thought")}
    </BubbleThought>
  </Distortion>
)

const OtherBlaming = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("other_blaming")} {"🧛‍"}
    </SubHeader>

    <Paragraph>
      {i18n.t("other_blaming_explanation_1")} {`\n`}
    </Paragraph>

    <Paragraph>{i18n.t("other_blaming_explanation_2")}</Paragraph>

    <BubbleThought color="purple">
      {i18n.t("other_blaming_thought")}
    </BubbleThought>
  </Distortion>
)

const OverGeneralization = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("over_generalization")} {"👯‍"}
    </SubHeader>

    <Paragraph>{i18n.t("over_generalization_explanation")}</Paragraph>

    <BubbleThought>{i18n.t("over_generalization_thought")}</BubbleThought>
  </Distortion>
)

const SelfBlaming = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("self_blaming")}
      {"👁"}
    </SubHeader>

    <Paragraph>{i18n.t("self_blaming_explanation")}</Paragraph>

    <BubbleThought color="pink">{i18n.t("self_blaming_thought")}</BubbleThought>
  </Distortion>
)

const ShouldStatements = () => (
  <Distortion>
    <SubHeader>
      {i18n.t("should_statements")} {"✨"}
    </SubHeader>

    <Paragraph>
      {i18n.t("should_statements_explanation_1")} {"\n"}
    </Paragraph>

    <Paragraph>{i18n.t("should_statements_explanation_2")}</Paragraph>

    <BubbleThought>{i18n.t("should_statements_thought")}</BubbleThought>
  </Distortion>
)

export default function ExplanationScreen(props: Props): JSX.Element {
  function navigateToOnboardingScreen() {
    props.navigation.navigate(Screen.ONBOARDING)
  }

  return (
    <ScrollView
      style={{
        marginTop: Constants.statusBarHeight,
        paddingTop: 24,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          marginBottom: Constants.statusBarHeight + 24,
        }}
      >
        <View
          style={{
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Header allowFontScaling={false}>
            {i18n.t("explanation_screen.header")}
          </Header>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                marginRight: 8,
              }}
            >
              <GhostButton
                title={i18n.t("explanation_screen.intro")}
                width={80}
                height={48}
                borderColor={theme.lightGray}
                textColor={theme.veryLightText}
                onPress={navigateToOnboardingScreen}
              />
            </View>
            <IconButton
              featherIconName={"x"}
              accessibilityLabel={i18n.t("accessibility.new_thought_button")}
              onPress={() => {
                haptic.impact(Haptic.ImpactFeedbackStyle.Light)
                props.navigation.pop()
              }}
            />
          </View>
        </View>

        <View
          style={{
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ActionButton
            flex={1}
            title={i18n.t("onboarding_screen.header")}
            fillColor="#EDF0FC"
            textColor={theme.darkBlue}
            onPress={() => {
              const url = "https://freecbt.erosson.org/explanation?ref=quirk"
              Linking.canOpenURL(url).then(() => Linking.openURL(url))
            }}
          />
        </View>

        <AllOrNothingThinking />
        <Catastrophizing />
        <EmotionalReasoning />
        <FortuneTelling />
        <Labeling />
        <MagnificationOfTheNegative />
        <MindReading />
        <MimizationOfThePositive />
        <OtherBlaming />
        <OverGeneralization />
        <SelfBlaming />
        <ShouldStatements />
      </View>
    </ScrollView>
  )
}
