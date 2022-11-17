import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export const enum Screen {
    CBT_FORM = "CBT_FORM_SCREEN",
    CBT_LIST = "CBT_LIST_SCREEN",
    ONBOARDING = "ONBOARDING_SCREEN",
    EXPLANATION = "EXPLANATION_SCREEN",
    SETTING = "SETTING_SCREEN",
    INIT = "INIT_SCREEN",
    FINISHED_THOUGHT = "FINISHED_THOUGHT_SCREEN",
    LOCK = "LOCK_SCREEN",
    DEBUG = "DEBUG_SCREEN",
}

export type ParamList = {
    [Screen.CBT_FORM]: {fromOnboarding: boolean} | undefined,
    // [Screen.CBT_LIST]: undefined,
    [Screen.ONBOARDING]: undefined,
    [Screen.EXPLANATION]: undefined,
    // [Screen.SETTING]: undefined,
    // [Screen.INIT]: undefined,
    // [Screen.FINISHED_THOUGHT]: undefined,
    // [Screen.LOCK]: undefined,
    [Screen.DEBUG]: undefined,
}

export type NavigationProp = NativeStackNavigationProp<ParamList>

export type ScreenProps<T extends keyof ParamList> = NativeStackScreenProps<ParamList, T>