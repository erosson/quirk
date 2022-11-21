import React from "react"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screen, ParamList } from "./src/screens"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as Feature from "./src/feature";
import CBTListScreen from "./src/screen/CBTListScreen";
import CBTFormScreen from "./src/screen/FormScreen";
import ExplanationScreen from "./src/screen/ExplanationScreen";
import SettingScreen from "./src/screen/SettingsScreen";
import OnboardingScreen from "./src/screen/OnboardingScreen";
import InitScreen from "./src/screen/InitScreen";
import LockScreen from "./src/screen/LockScreen";
import DebugScreen from "./src/screen/DebugScreen";
import CBTViewScreen from "./src/screen/CBTViewScreen";

const Stack = createNativeStackNavigator<ParamList>()

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={Screen.INIT}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name={Screen.CBT_FORM} component={CBTFormScreen} />
          <Stack.Screen name={Screen.CBT_LIST} component={CBTListScreen} />
          <Stack.Screen name={Screen.ONBOARDING} component={OnboardingScreen} />
          <Stack.Screen name={Screen.EXPLANATION} component={ExplanationScreen} />
          <Stack.Screen name={Screen.SETTING} component={SettingScreen} />
          <Stack.Screen name={Screen.INIT} component={InitScreen} />
          <Stack.Screen name={Screen.CBT_VIEW} component={CBTViewScreen} />
          <Stack.Screen name={Screen.LOCK} component={LockScreen} />
          <Stack.Screen name={Screen.DEBUG} component={DebugScreen} options={{ headerShown: true, title: "" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default Feature.withState(App)
