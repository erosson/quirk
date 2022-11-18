import React from "react"
import Carousel from "react-native-reanimated-carousel"
import { sliderWidth, itemWidth } from "../form/sizes"
import { View, Image, Linking, Alert, Dimensions } from "react-native"
import { Header, Container, Paragraph, ActionButton, Row } from "../ui"
import Constants from "expo-constants"
import * as Haptic from "expo-haptics"
import theme from "../theme"
import haptic from "../haptic"
import { Screen, NavigationProp } from "../screens"
import { FadesIn } from "../animations"
import i18n from "../i18n"
// import { setNotifications } from "./SettingsScreen";
import * as Feature from "../feature"

interface ScreenProps {
  navigation: NavigationProp
}

const RecordStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/looker/Looker.png")}
      style={{
        width: 156,
        height: 156,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_screen.readme")}
    </Header>
    <ActionButton
      flex={1}
      width="100%"
      title={i18n.t("onboarding_screen.header")}
      fillColor="#EDF0FC"
      textColor={theme.darkBlue}
      onPress={() => {
        const url = "https://freecbt.erosson.org/explanation?ref=quirk"
        Linking.canOpenURL(url).then((canOpen) => {
          if (!canOpen) {
            Alert.alert(
              "You can't open this",
              `We're not sure why, but your phone is telling us that you can't open this link. You can find it at '${url}'`
            )
          }
          Linking.openURL(url)
        })
      }}
    />
  </View>
)

const ChallengeStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/eater/eater.png")}
      style={{
        width: 156,
        height: 156,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_screen.block1.header")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_screen.block1.body")}
    </Paragraph>
  </View>
)

const ChangeStep = () => (
  <View
    style={{
      height: "100%",
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Image
      source={require("../../assets/logo/logo.png")}
      style={{
        width: 156,
        height: 156,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 48,
      }}
    />
    <Header
      style={{
        fontSize: 28,
      }}
    >
      {i18n.t("onboarding_screen.block2.header")}
    </Header>
    <Paragraph
      style={{
        fontSize: 20,
      }}
    >
      {i18n.t("onboarding_screen.block2.body")}
    </Paragraph>
  </View>
)

const RemindersStep = ({ onContinue }) => {
  const { feature } = React.useContext(Feature.Context)
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Image
        source={require("../../assets/notifications/notifications.png")}
        style={{
          width: 256,
          height: 196,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 48,
        }}
      />
      <Header
        style={{
          fontSize: 28,
          marginBottom: 12,
        }}
      >
        {feature.reminders
          ? i18n.t("onboarding_screen.reminders.header")
          : i18n.t("onboarding_screen.reminders.disabled")}
      </Header>
      {feature.reminders ? (
        <>
          <Row
            style={{
              marginBottom: 8,
            }}
          >
            <ActionButton
              flex={1}
              width="100%"
              title={i18n.t("onboarding_screen.reminders.button.yes")}
              onPress={async () => {
                // await DEBUGsetNotifications(feature, true);
                onContinue()
              }}
            />
          </Row>
          <Row>
            <ActionButton
              flex={1}
              width="100%"
              title={i18n.t("onboarding_screen.reminders.button.no")}
              fillColor="#EDF0FC"
              textColor={theme.darkBlue}
              onPress={onContinue}
            />
          </Row>
        </>
      ) : (
        <Row>
          <ActionButton
            flex={1}
            width="100%"
            title={i18n.t("onboarding_screen.reminders.button.continue")}
            fillColor="#EDF0FC"
            textColor={theme.darkBlue}
            onPress={onContinue}
          />
        </Row>
      )}
    </View>
  )
}

export default class extends React.Component<ScreenProps> {
  static navigationOptions = {
    header: null,
  }

  state = {
    activeSlide: 0,
    isReady: false,
  }

  componentDidMount() {
    // Triggers a fade in for fancy reasons
    setTimeout(() => {
      this.setState({
        isReady: true,
      })
    }, 60)
  }

  stopOnBoarding = () => {
    haptic.notification(Haptic.NotificationFeedbackType.Success)
    this.props.navigation.replace(Screen.CBT_FORM, {
      fromOnboarding: true,
    })
  }

  _renderItem = ({ item, index }) => {
    if (item.slug === "record") {
      return <RecordStep />
    }

    if (item.slug === "challenge") {
      return <ChallengeStep />
    }

    if (item.slug === "change") {
      return <ChangeStep />
    }

    if (item.slug === "reminders-or-continue") {
      return <RemindersStep onContinue={this.stopOnBoarding} />
    }

    return null
  }

  render() {
    const { width, height } = Dimensions.get("window")
    return (
      <Container
        style={{
          height: "100%",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: Constants.statusBarHeight + 12,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingBottom: 0,
        }}
      >
        <FadesIn pose={this.state.isReady ? "visible" : "hidden"}>
          <Carousel
            width={width}
            // width={sliderWidth}
            // height={Dimensions.get('window').width / 2}
            height={height}
            data={[
              { slug: "record" },
              { slug: "challenge" },
              { slug: "change" },
              { slug: "reminders-or-continue" },
            ]}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
            loop={false}
            pagingEnabled={true}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: Math.round(width * 0.15),
            }}
          />
        </FadesIn>
      </Container>
    )
  }
}
