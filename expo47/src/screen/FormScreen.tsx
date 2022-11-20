import { Container, Row, Header, IconButton } from "../ui"
import React from "react"
import { StatusBar } from "react-native"
import theme from "../theme"
import Constants from "expo-constants"
import i18n from "../i18n"
import { Screen, ScreenProps } from "../screens"
import * as flagstore from "../flagstore"
import FormView, { Slides } from "../form/FormView"
import { SavedThought, Thought, newThought } from "../thoughts"
import { getIsExistingUser, setIsExistingUser } from "../thoughtstore"
import haptic from "../haptic"
import { FadesIn } from "../animations"
import * as AsyncState from "../async-state"

type Props = ScreenProps<Screen.CBT_FORM>

export default function FormScreen(props: Props): JSX.Element {
  const { fromOnboarding } = props.route.params ?? {}
  const showHelpBadge = AsyncState.useAsyncState(() =>
    flagstore.get("start-help-badge", "true")
  )
  const [thought, setThought] = React.useState<Thought | SavedThought>(
    props.route.params?.thought ?? newThought()
  )

  // `slide` is set from props on init, props on update, or setSlide in this file
  const slideProp = props.route.params?.slide
  const [slide, setSlide] = React.useState<Slides>(slideProp ?? "automatic")
  React.useEffect(() => {
    if (slideProp) {
      setSlide(slideProp)
    }
  }, [slideProp])

  // redirect to onboarding if this is the first time opening the app
  AsyncState.useAsyncEffect(async () => {
    if (!(await getIsExistingUser())) {
      await setIsExistingUser()
      props.navigation.replace(Screen.ONBOARDING)
    }
  })

  function onSave(t) {
    props.navigation.push(Screen.FINISHED_THOUGHT, { thought: t })
    setSlide("automatic")
  }

  function onChangeAutomaticThought(val: string) {
    setThought({ ...thought, automaticThought: val })
  }
  function onChangeChallenge(val: string) {
    setThought({ ...thought, challenge: val })
  }
  function onChangeAlternativeThought(val: string) {
    setThought({ ...thought, alternativeThought: val })
  }
  function onChangeDistortion(selected: string) {
    haptic.selection() // iOS users get a selected buzz
    const { cognitiveDistortions } = thought
    const index = cognitiveDistortions.findIndex(
      ({ slug }) => slug === selected
    )
    cognitiveDistortions[index].selected = !cognitiveDistortions[index].selected
    setThought({ ...thought, cognitiveDistortions })
  }

  return (
    <FadesIn
      style={{
        backgroundColor: theme.lightOffwhite,
        height: "100%",
      }}
      pose="visible"
    >
      <StatusBar barStyle="dark-content" />
      <Container
        style={{
          height: "100%",
          paddingLeft: 0,
          paddingRight: 0,
          marginTop: Constants.statusBarHeight,
          paddingTop: 12,
          paddingBottom: 0,
        }}
      >
        <Row
          style={{
            marginBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <IconButton
            featherIconName={"help-circle"}
            accessibilityLabel={i18n.t("accessibility.help_button")}
            onPress={async () => {
              await flagstore.setFalse("start-help-badge")
              // thxis.setState({ shouldShowHelpBadge: false })
              props.navigation.push(Screen.EXPLANATION)
            }}
            hasBadge={AsyncState.withDefault(showHelpBadge, false)}
          />
          <Header allowFontScaling={false}>{i18n.t("cbt_form.header")}</Header>
          <IconButton
            accessibilityLabel={i18n.t("accessibility.list_button")}
            featherIconName={"list"}
            onPress={() => {
              props.navigation.push(Screen.CBT_LIST)
            }}
          />
        </Row>
        <FormView
          onSave={onSave}
          thought={thought}
          slideToShow={slide}
          shouldShowInFlowOnboarding={fromOnboarding}
          onChangeAlternativeThought={onChangeAlternativeThought}
          onChangeAutomaticThought={onChangeAutomaticThought}
          onChangeChallenge={onChangeChallenge}
          onChangeDistortion={onChangeDistortion}
        />
      </Container>
    </FadesIn>
  )
}
