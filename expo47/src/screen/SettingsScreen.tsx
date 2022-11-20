import React from "react"
import { ScrollView, StatusBar, Platform } from "react-native"
import * as Notifications from "expo-notifications"
import theme from "../theme"
import Constants from "expo-constants"
import * as Linking from "expo-linking"
import * as Feature from "../feature"
import {
  Header,
  Row,
  Container,
  IconButton,
  SubHeader,
  Paragraph,
  RoundedSelectorButton,
  ActionButton,
} from "../ui"
import { Screen, ScreenProps } from "../screens"
import {
  setSetting,
  removeSetting,
  getSetting,
  getSettingOrSetDefault,
} from "../setting/settingstore"
import { hasPincode, clearPincode } from "../lockstore"
import {
  HISTORY_BUTTON_LABEL_KEY,
  HISTORY_BUTTON_LABEL_DEFAULT,
  NOTIFICATIONS_KEY,
  LOCALE_KEY,
  HistoryButtonLabelSetting,
  isHistoryButtonLabelSetting,
} from "../setting"
import i18n from "../i18n"
import { FadesIn } from "../animations"
import * as Localization from "expo-localization"
import { Picker } from "@react-native-picker/picker"

export { HistoryButtonLabelSetting }

// Exportable settings
export async function getHistoryButtonLabel(): Promise<HistoryButtonLabelSetting> {
  const value = await getSettingOrSetDefault(
    HISTORY_BUTTON_LABEL_KEY,
    HISTORY_BUTTON_LABEL_DEFAULT
  )

  if (!isHistoryButtonLabelSetting(value)) {
    console.error(
      `Something went wrong getting ${HISTORY_BUTTON_LABEL_KEY}. Got: "${value}"`
    )
    return HISTORY_BUTTON_LABEL_DEFAULT
  }

  return value
}

export async function getLocaleSetting(): Promise<string> {
  return await getSetting(LOCALE_KEY)
}
export async function setLocaleSetting(
  locale: string | null
): Promise<boolean> {
  if (locale) {
    i18n.locale = locale
    return await setSetting(LOCALE_KEY, locale)
  } else {
    i18n.locale = Localization.locale
    return await removeSetting(LOCALE_KEY)
  }
}
export async function getNotifications(): Promise<boolean> {
  try {
    const str = await getSettingOrSetDefault(NOTIFICATIONS_KEY, "false")
    return JSON.parse(str)
  } catch (e) {
    return false
  }
}

export async function setNotifications(
  feature: Feature.Feature,
  enabled: boolean
): Promise<boolean> {
  await Notifications.cancelAllScheduledNotificationsAsync()
  // don't enable without permission
  enabled = enabled && (await registerForLocalNotificationsAsync())
  if (enabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("reminder_notification.intro.title"),
        body: i18n.t("reminder_notification.intro.body"),
        color: "#F78FB3",
        // icon: "https://freecbt.erosson.org/static/favicon/favicon.ico",
        // icon: "https://freecbt.erosson.org/notifications/quirk-bw.png",
      },
      trigger: null,
    })
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("reminder_notification.1.title"),
        body: i18n.t("reminder_notification.1.body"),
        color: "#F78FB3",
        // icon: "https://freecbt.erosson.org/static/favicon/favicon.ico",
        // icon: "https://freecbt.erosson.org/notifications/quirk-bw.png",
      },
      trigger: feature.remindersEachMinute
        ? { channelId: "default", repeats: true, seconds: 60 } // ridiculously often, for debugging
        : // TODO use dailynotificationtrigger/calendarnotificationtrigger
          // https://docs.expo.dev/versions/latest/sdk/notifications/#notificationcontentinput
          { channelId: "default", repeats: true, seconds: 86400 },
    })
  }
  setSetting(NOTIFICATIONS_KEY, JSON.stringify(enabled))
  return enabled
}

async function registerForLocalNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== "granted") {
    return false
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }
  return true
}

type Props = ScreenProps<Screen.SETTING>

interface State {
  isReady: boolean
  historyButtonLabel?: HistoryButtonLabelSetting
  areNotificationsOn: boolean
  hasPincode: boolean
  localeSetting: string | null
  // click the invisible button at the bottom 5 times to go to the secret debug screen
  debugClicks: number
}

class SettingScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      areNotificationsOn: false,
      hasPincode: false,
      localeSetting: null,
      debugClicks: 0,
    }
  }

  async componentDidMount() {
    await this.refresh()
  }

  refresh = async () => {
    const [h, n, p, l] = await Promise.all([
      getHistoryButtonLabel(),
      getNotifications(),
      hasPincode(),
      getLocaleSetting(),
    ])
    this.setState({
      historyButtonLabel: h,
      areNotificationsOn: n,
      hasPincode: p,
      localeSetting: l,
      isReady: true,
    })
  }

  navigateToList = () => {
    this.props.navigation.pop()
  }

  navigateToOnboardingScreen = () => {
    this.props.navigation.navigate(Screen.ONBOARDING)
  }

  toggleHistoryButtonLabels = () => {
    if (!this.state.isReady) {
      this.refresh()
      return
    }

    if (this.state.historyButtonLabel === "alternative-thought") {
      setSetting<HistoryButtonLabelSetting>(
        HISTORY_BUTTON_LABEL_KEY,
        "automatic-thought"
      )
      this.refresh()
    } else {
      setSetting<HistoryButtonLabelSetting>(
        HISTORY_BUTTON_LABEL_KEY,
        "alternative-thought"
      )
      this.refresh()
    }
  }

  render() {
    const { historyButtonLabel, isReady } = this.state

    return (
      <Feature.Context.Consumer>
        {({ feature }) => (
          <FadesIn
            style={{ backgroundColor: theme.lightOffwhite }}
            pose={isReady ? "visible" : "hidden"}
          >
            <ScrollView
              style={{
                backgroundColor: theme.lightOffwhite,
                marginTop: Constants.statusBarHeight,
                paddingTop: 24,
                height: "100%",
              }}
            >
              <Container
                style={{
                  paddingBottom: 128,
                }}
              >
                <StatusBar barStyle="dark-content" />
                <Row style={{ marginBottom: 18 }}>
                  <Header>{i18n.t("settings.header")}</Header>
                  <IconButton
                    featherIconName={"list"}
                    accessibilityLabel={i18n.t("accessibility.list_button")}
                    onPress={() => this.navigateToList()}
                  />
                </Row>

                {feature.reminders && (
                  <Row
                    style={{
                      marginBottom: 18,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <SubHeader>{i18n.t("settings.reminders.header")}</SubHeader>
                    <Paragraph
                      style={{
                        marginBottom: 9,
                      }}
                    >
                      {i18n.t("settings.reminders.description")}
                    </Paragraph>
                    <RoundedSelectorButton
                      title={i18n.t("settings.reminders.button.yes")}
                      selected={this.state.areNotificationsOn}
                      onPress={async () => {
                        await setNotifications(feature, true)
                        this.refresh()
                      }}
                    />

                    <RoundedSelectorButton
                      title={i18n.t("settings.reminders.button.no")}
                      selected={!this.state.areNotificationsOn}
                      onPress={async () => {
                        await setNotifications(feature, false)
                        this.refresh()
                      }}
                    />
                  </Row>
                )}
                <Row
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <SubHeader>{i18n.t("settings.pincode.header")}</SubHeader>
                  <Paragraph
                    style={{
                      marginBottom: 9,
                    }}
                  >
                    {i18n.t("settings.pincode.description")}
                  </Paragraph>
                  {this.state.hasPincode ? (
                    <>
                      <ActionButton
                        flex={1}
                        title={i18n.t("settings.pincode.button.update")}
                        width={"100%"}
                        fillColor="#EDF0FC"
                        textColor={theme.darkBlue}
                        onPress={() => {
                          this.props.navigation.push(Screen.LOCK, {
                            isSettingCode: true,
                          })
                        }}
                      />
                      <ActionButton
                        flex={1}
                        title={i18n.t("settings.pincode.button.clear")}
                        width={"100%"}
                        fillColor="#EDF0FC"
                        textColor={theme.darkBlue}
                        onPress={async () => {
                          await clearPincode()
                          this.refresh()
                        }}
                      />
                    </>
                  ) : (
                    <ActionButton
                      flex={1}
                      title={i18n.t("settings.pincode.button.set")}
                      width={"100%"}
                      fillColor="#EDF0FC"
                      textColor={theme.darkBlue}
                      onPress={() => {
                        this.props.navigation.push(Screen.LOCK, {
                          isSettingCode: true,
                        })
                      }}
                    />
                  )}
                </Row>

                <Row
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <SubHeader>{i18n.t("settings.history.header")}</SubHeader>
                  <Paragraph
                    style={{
                      marginBottom: 9,
                    }}
                  >
                    {i18n.t("settings.history.description")}
                  </Paragraph>
                  <RoundedSelectorButton
                    title={i18n.t("settings.history.button.alternative")}
                    selected={historyButtonLabel === "alternative-thought"}
                    onPress={() => this.toggleHistoryButtonLabels()}
                  />
                  <RoundedSelectorButton
                    title={i18n.t("settings.history.button.automatic")}
                    selected={historyButtonLabel === "automatic-thought"}
                    onPress={() => this.toggleHistoryButtonLabels()}
                  />
                </Row>

                {feature.localeSetting && (
                  <Row
                    style={{
                      marginBottom: 18,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <SubHeader>{i18n.t("settings.locale.header")}</SubHeader>
                    {this.state.isReady && (
                      <Picker
                        selectedValue={this.state.localeSetting}
                        onValueChange={async (val) => {
                          this.setState({ localeSetting: val })
                          await setLocaleSetting(val)
                        }}
                      >
                        <Picker.Item
                          label={i18n.t("settings.locale.default")}
                          value={null}
                        />
                        {Object.keys(i18n.translations)
                          .filter(
                            (locale) =>
                              !locale.startsWith("_") ||
                              feature.testLocalesVisible
                          )
                          .map((locale) => (
                            <Picker.Item
                              key={locale}
                              label={i18n.t("settings.locale.list." + locale)}
                              value={locale}
                            />
                          ))}
                      </Picker>
                    )}
                  </Row>
                )}

                {feature.localeSetting && (
                  <Row
                    style={{
                      marginBottom: 9,
                    }}
                  >
                    <ActionButton
                      flex={1}
                      title={i18n.t("settings.locale.contribute")}
                      fillColor="#EDF0FC"
                      textColor={theme.darkBlue}
                      onPress={() => {
                        const url =
                          "https://github.com/erosson/freecbt/blob/master/TRANSLATIONS.md"
                        Linking.canOpenURL(url).then(() => Linking.openURL(url))
                      }}
                    />
                  </Row>
                )}
                <Row
                  style={{
                    marginBottom: 9,
                  }}
                >
                  <ActionButton
                    flex={1}
                    title={i18n.t("settings.privacy")}
                    fillColor="#EDF0FC"
                    textColor={theme.darkBlue}
                    onPress={() => {
                      const url =
                        "https://github.com/erosson/freecbt/blob/master/PRIVACY.md"
                      Linking.canOpenURL(url).then(() => Linking.openURL(url))
                    }}
                  />
                </Row>
                <Row>
                  <ActionButton
                    flex={1}
                    title={i18n.t("settings.terms")}
                    fillColor="#EDF0FC"
                    textColor={theme.darkBlue}
                    onPress={() => {
                      const url =
                        "https://github.com/erosson/freecbt/blob/master/TOS.md"
                      Linking.canOpenURL(url).then(() => Linking.openURL(url))
                    }}
                  />
                </Row>
                <Row>
                  <ActionButton
                    flex={1}
                    opacity={feature.debugVisible ? 1 : 0}
                    fillColor={feature.debugVisible ? null : "#ffffff"}
                    textColor={feature.debugVisible ? null : "#ffffff"}
                    title={"Debug"}
                    onPress={() => {
                      const debugClicks = this.state.debugClicks + 1
                      this.setState({ debugClicks })
                      if (debugClicks >= 5) {
                        this.setState({ debugClicks: 0 })
                        this.props.navigation.push(Screen.DEBUG)
                      }
                    }}
                  />
                </Row>
              </Container>
            </ScrollView>
          </FadesIn>
        )}
      </Feature.Context.Consumer>
    )
  }
}

export default SettingScreen
