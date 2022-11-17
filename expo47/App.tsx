import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screen, ParamList } from "./src/screens"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Feature from "./src/feature";
// import CBTListScreen from "./src/CBTListScreen";
import CBTFormScreen from "./src/form/FormScreen";
// import FinishedThoughtScreen from "./src/form/FinishedThoughtScreen";
import ExplanationScreen from "./src/ExplanationScreen";
// import SettingScreen from "./src/SettingsScreen";
import OnboardingScreen from "./src/OnboardingScreen";
// import InitScreen from "./src/InitScreen";
// import LockScreen from "./src/lock/LockScreen";
import DebugScreen from "./src/DebugScreen";
// import Storybook from "./storybook";

const Stack = createNativeStackNavigator<ParamList>()

export function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName={Screen.DEBUG}
          initialRouteName={Screen.CBT_FORM}
          screenOptions={{headerShown: false}}
        >
          <Stack.Screen name={Screen.EXPLANATION} component={ExplanationScreen} />
          <Stack.Screen name={Screen.ONBOARDING} component={OnboardingScreen} />
          <Stack.Screen name={Screen.CBT_FORM} component={CBTFormScreen} />
          {/* <Stack.Screen name={Screen.SETTING} component={SettingScreen} /> */}
          <Stack.Screen name={Screen.DEBUG} component={DebugScreen} options={{headerShown: true, title: ""}} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
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
export default Feature.withState(App)
