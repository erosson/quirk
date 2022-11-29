import React from "react"
import { ScrollView, StatusBar, Platform, Text } from "react-native"
import * as Notifications from "expo-notifications"
import theme from "../theme"
import Constants from "expo-constants"
import * as Linking from "expo-linking"
import * as Feature from "../feature"
import * as AsyncState from "../async-state"
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

export async function getLocaleSetting(): Promise<string | null> {
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

export default function SettingScreen(props: Props): JSX.Element {
  const [refresh, setRefresh] = React.useState(0)
  const historyButtonLabel =
    AsyncState.useAsyncState<HistoryButtonLabelSetting>(getHistoryButtonLabel, [
      refresh,
    ])
  const areNotificationsOn = AsyncState.useAsyncState<boolean>(getNotifications)
  const hasPincode_ = AsyncState.useAsyncState<boolean>(hasPincode, [refresh])
  const localeSetting = AsyncState.useAsyncState<string | null>(
    getLocaleSetting,
    [refresh]
  )
  const [debugClicks, setDebugClicks] = React.useState(0)

  async function toggleHistoryButtonLabels() {
    if (AsyncState.isSuccess(historyButtonLabel)) {
      await setSetting<HistoryButtonLabelSetting>(
        HISTORY_BUTTON_LABEL_KEY,
        historyButtonLabel.value === "alternative-thought"
          ? "automatic-thought"
          : "alternative-thought"
      )
      setRefresh(refresh + 1)
    }
  }

  return (
    <Feature.Context.Consumer>
      {({ feature }) => (
        <FadesIn
          style={{ backgroundColor: theme.lightOffwhite }}
          pose="visible"
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
                  onPress={() => {
                    props.navigation.pop()
                  }}
                />
              </Row>

              {feature.reminders &&
                AsyncState.fold(
                  areNotificationsOn,
                  () => null,
                  () => null,
                  (error) => <Text>{error}</Text>,
                  (notify) => (
                    <Row
                      style={{
                        marginBottom: 18,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <SubHeader>
                        {i18n.t("settings.reminders.header")}
                      </SubHeader>
                      <Paragraph
                        style={{
                          marginBottom: 9,
                        }}
                      >
                        {i18n.t("settings.reminders.description")}
                      </Paragraph>
                      <RoundedSelectorButton
                        title={i18n.t("settings.reminders.button.yes")}
                        selected={notify}
                        onPress={async () => {
                          await setNotifications(feature, true)
                          setRefresh(refresh + 1)
                        }}
                      />

                      <RoundedSelectorButton
                        title={i18n.t("settings.reminders.button.no")}
                        selected={!notify}
                        onPress={async () => {
                          await setNotifications(feature, false)
                          setRefresh(refresh + 1)
                        }}
                      />
                    </Row>
                  )
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
                {AsyncState.fold(
                  hasPincode_,
                  () => null,
                  () => null,
                  (error) => (
                    <Text>{error}</Text>
                  ),
                  (show) =>
                    show ? (
                      <>
                        <ActionButton
                          flex={1}
                          title={i18n.t("settings.pincode.button.update")}
                          width={"100%"}
                          fillColor="#EDF0FC"
                          textColor={theme.darkBlue}
                          onPress={() => {
                            props.navigation.push(Screen.LOCK, {
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
                            setRefresh(refresh + 1)
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
                          props.navigation.push(Screen.LOCK, {
                            isSettingCode: true,
                          })
                        }}
                      />
                    )
                )}
              </Row>

              {AsyncState.fold(
                historyButtonLabel,
                () => null,
                () => null,
                (error) => (
                  <Text>{error}</Text>
                ),
                (label) => (
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
                      selected={label === "alternative-thought"}
                      onPress={toggleHistoryButtonLabels}
                    />
                    <RoundedSelectorButton
                      title={i18n.t("settings.history.button.automatic")}
                      selected={label === "automatic-thought"}
                      onPress={toggleHistoryButtonLabels}
                    />
                  </Row>
                )
              )}

              {feature.localeSetting &&
                AsyncState.fold(
                  localeSetting,
                  () => null,
                  () => null,
                  (error) => <Text>{error}</Text>,
                  (locale) => (
                    <Row
                      style={{
                        marginBottom: 18,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <SubHeader>{i18n.t("settings.locale.header")}</SubHeader>
                      <Picker
                        selectedValue={locale}
                        onValueChange={async (val) => {
                          await setLocaleSetting(val)
                          setRefresh(refresh + 1)
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
                    </Row>
                  )
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
                  fillColor={feature.debugVisible ? undefined : "#ffffff"}
                  textColor={feature.debugVisible ? undefined : "#ffffff"}
                  title={"Debug"}
                  onPress={() => {
                    const clicks = debugClicks + 1
                    if (clicks >= 5) {
                      setDebugClicks(0)
                      props.navigation.push(Screen.DEBUG)
                    } else {
                      setDebugClicks(clicks)
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
