import React from "react";
import { NavigationState, NavigationAction } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { recordScreenCallOnFocus } from "../navigation";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../form/sizes";
import { View, Image, Linking, Alert } from "react-native";
import { Header, Container, Paragraph, ActionButton, Row } from "../ui";
import Constants from "expo-constants";
import * as Haptic from "expo-haptics";
import theme from "../theme";
import haptic from "../haptic";
import * as stats from "../stats";
import { CBT_FORM_SCREEN } from "../screens";
import { FadesIn } from "../animations";
import i18n from "../i18n";
import { setNotifications } from "../SettingsScreen";
import * as Feature from "../feature";

interface ScreenProps {
  navigation: NavigationStackProp<NavigationState, NavigationAction>;
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
        stats.userClickedQuirkGuide();
        const url = "https://freecbt.erosson.org/explanation?ref=quirk";
        Linking.canOpenURL(url).then((canOpen) => {
          if (!canOpen) {
            stats.userCantOpenLink();
            Alert.alert(
              "You can't open this",
              `We're not sure why, but your phone is telling us that you can't open this link. You can find it at '${url}'`
            );
          }
          Linking.openURL(url);
        });
      }}
    />
  </View>
);

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
);

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
);

const RemindersStep = ({ onContinue }) => {
  const { feature } = React.useContext(Feature.Context);
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
                await setNotifications(feature, true);
                onContinue();
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
  );
};

export default class extends React.Component<ScreenProps> {
  static navigationOptions = {
    header: null,
  };

  state = {
    activeSlide: 0,
    isReady: false,
  };

  _carousel = null;

  constructor(props) {
    super(props);
    recordScreenCallOnFocus(this.props.navigation, "intro");
  }

  componentDidMount() {
    // Triggers a fade in for fancy reasons
    setTimeout(() => {
      this.setState({
        isReady: true,
      });
    }, 60);
  }

  stopOnBoarding = () => {
    haptic.notification(Haptic.NotificationFeedbackType.Success);
    stats.endedOnboarding();
    this.props.navigation.replace(CBT_FORM_SCREEN, {
      fromOnboarding: true,
    });
  };

  _renderItem = ({ item, index }) => {
    if (item.slug === "record") {
      return <RecordStep />;
    }

    if (item.slug === "challenge") {
      return <ChallengeStep />;
    }

    if (item.slug === "change") {
      return <ChangeStep />;
    }

    if (item.slug === "reminders-or-continue") {
      return <RemindersStep onContinue={this.stopOnBoarding} />;
    }

    return null;
  };

  render() {
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
            ref={(c) => {
              this._carousel = c;
            }}
            data={[
              { slug: "record" },
              { slug: "challenge" },
              { slug: "change" },
              { slug: "reminders-or-continue" },
            ]}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
          />

          <Pagination
            dotsLength={4}
            activeDotIndex={this.state.activeSlide}
            containerStyle={{
              margin: 0,
              padding: 0,
              backgroundColor: "transparent",
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.pink,
            }}
            inactiveDotStyle={{
              backgroundColor: theme.gray,
            }}
          />
        </FadesIn>
      </Container>
    );
  }
}
