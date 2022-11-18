import { ActionButton } from "../ui"
import React from "react"
import Carousel from "react-native-reanimated-carousel"
import { View, Keyboard } from "react-native"
import * as Haptic from "expo-haptics"
import { sliderWidth, itemWidth } from "./sizes"
import { Thought } from "../thoughts"
import universalHaptic from "../haptic"
import AutomaticThought from "./AutomaticThought"
import AlternativeThought from "./AlternativeThought"
import Challenge from "./Challenge"
import Distortions from "./Distortions"
import { saveExercise } from "../thoughtstore"
import i18n from "../i18n"

export type Slides = "automatic" | "distortions" | "challenge" | "alternative"

const slideToIndex = (slide: Slides): number => {
  switch (slide) {
    case "automatic":
      return 0
    case "distortions":
      return 1
    case "challenge":
      return 2
    case "alternative":
      return 3
  }
}

interface FormViewProps {
  onSave: (thought: Thought) => void
  thought: Thought
  slideToShow: Slides
  shouldShowInFlowOnboarding: boolean
  onChangeAutomaticThought: (val: string) => void
  onChangeChallenge: (val: string) => void
  onChangeAlternativeThought: (val: string) => void
  onChangeDistortion: (selected: string) => void
}

interface FormViewState {
  activeSlide: number
}

export default class extends React.Component<FormViewProps, FormViewState> {
  static navigationOptions = {
    header: null,
  }

  state = {
    activeSlide: 0,
  }

  onSave = () => {
    universalHaptic.notification(Haptic.NotificationFeedbackType.Success)

    saveExercise(this.props.thought).then((thought) => {
      this.props.onSave(thought)
    })
  }

  _renderItem = ({ item, index }) => {
    const { thought } = this.props

    if (item.slug === "automatic-thought") {
      return (
        <AutomaticThought
          value={thought.automaticThought}
          onChange={this.props.onChangeAutomaticThought}
        />
      )
    }

    if (item.slug === "distortions") {
      return (
        <Distortions
          distortions={thought.cognitiveDistortions}
          onChange={this.props.onChangeDistortion}
        />
      )
    }

    if (item.slug === "challenge") {
      return (
        <Challenge
          value={thought.challenge}
          onChange={this.props.onChangeChallenge}
        />
      )
    }

    if (item.slug === "alternative-thought") {
      return (
        <>
          <AlternativeThought
            value={thought.alternativeThought}
            onChange={this.props.onChangeAlternativeThought}
          />

          <View
            style={{
              marginTop: 12,
            }}
          >
            <ActionButton
              title={i18n.t("cbt_form.submit")}
              width="100%"
              onPress={this.onSave}
            />
          </View>
        </>
      )
    }

    return null
  }

  render() {
    return (
      <Carousel
        data={[
          { slug: "automatic-thought" },
          { slug: "distortions" },
          { slug: "challenge" },
          { slug: "alternative-thought" },
        ]}
        renderItem={this._renderItem}
        width={sliderWidth}
        onSnapToItem={(index) => {
          this.setState({ activeSlide: index })
          Keyboard.dismiss()
        }}
        loop={false}
        defaultIndex={slideToIndex(this.props.slideToShow)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: Math.round(sliderWidth * 0.15),
        }}
        // fix vertical scrolling for distortions
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />
    )
  }
}
