import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  CBT_LIST_SCREEN,
  CBT_FORM_SCREEN,
  EXPLANATION_SCREEN,
  SETTING_SCREEN,
  CBT_ON_BOARDING_SCREEN,
  INIT_SCREEN,
  CBT_VIEW_SCREEN,
  LOCK_SCREEN,
  DEBUG_SCREEN,
} from "./src/screens";
import * as Feature from "./src/feature";
import CBTListScreen from "./src/CBTListScreen";
import CBTFormScreen from "./src/form/FormScreen";
import FinishedThoughtScreen from "./src/form/FinishedThoughtScreen";
import ExplanationScreen from "./src/ExplanationScreen";
import SettingScreen from "./src/SettingsScreen";
import OnboardingScreen from "./src/onboarding/OnboardingScreen";
import InitScreen from "./src/InitScreen";
import LockScreen from "./src/lock/LockScreen";
import DebugScreen from "./src/DebugScreen";
// import Storybook from "./storybook";

const App = createStackNavigator(
  {
    [INIT_SCREEN]: InitScreen,
    [CBT_ON_BOARDING_SCREEN]: OnboardingScreen,
    [CBT_LIST_SCREEN]: CBTListScreen,
    [CBT_FORM_SCREEN]: CBTFormScreen,
    [EXPLANATION_SCREEN]: ExplanationScreen,
    [SETTING_SCREEN]: SettingScreen,
    [CBT_VIEW_SCREEN]: FinishedThoughtScreen,
    [LOCK_SCREEN]: LockScreen,
    [DEBUG_SCREEN]: DebugScreen,
  },
  {
    initialRouteName: INIT_SCREEN,
    mode: "modal",
  }
);

// export default process.env.EXPO_STORYBOOK
  // ? Storybook
export default Feature.withState(createAppContainer(App));
