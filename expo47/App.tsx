import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screen } from "./src/screens"
import * as Feature from "./src/feature";
// import CBTListScreen from "./src/CBTListScreen";
// import CBTFormScreen from "./src/form/FormScreen";
// import FinishedThoughtScreen from "./src/form/FinishedThoughtScreen";
// import ExplanationScreen from "./src/ExplanationScreen";
// import SettingScreen from "./src/SettingsScreen";
// import OnboardingScreen from "./src/onboarding/OnboardingScreen";
// import InitScreen from "./src/InitScreen";
// import LockScreen from "./src/lock/LockScreen";
import DebugScreen from "./src/DebugScreen";
import { StackFrame } from "react-native/Libraries/Core/Devtools/parseErrorStack";
// import Storybook from "./storybook";

const Stack = createNativeStackNavigator()

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Screen.DEBUG}
        // screenOptions={{headerShown: false}}
      >
        <Stack.Screen name={Screen.DEBUG} component={DebugScreen} options={{title: ""}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
//  {
//    // [INIT_SCREEN]: InitScreen,
//    // [CBT_ON_BOARDING_SCREEN]: OnboardingScreen,
//    // [CBT_LIST_SCREEN]: CBTListScreen,
//    // [CBT_FORM_SCREEN]: CBTFormScreen,
//    // [EXPLANATION_SCREEN]: ExplanationScreen,
//    // [SETTING_SCREEN]: SettingScreen,
//    // [CBT_VIEW_SCREEN]: FinishedThoughtScreen,
//    // [LOCK_SCREEN]: LockScreen,
//    [Screen.DEBUG.valueOf()]: DebugScreen,
//  },
//  {
//    // initialRouteName: INIT_SCREEN,
//    initialRouteName: Screen.DEBUG.valueOf(),
//    mode: "modal",
//  }
//);

// export default process.env.EXPO_STORYBOOK
  // ? Storybook
export default Feature.withState(App);
