import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Slides } from "./form/FormView";
import { SavedThought } from "./thoughts";

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
    [Screen.CBT_FORM]: {
        fromOnboarding?: boolean,
        clear?: boolean,
        // TODO replace with thought-id
        thought?: SavedThought
        slide?: Slides,
    } | undefined,
    [Screen.CBT_LIST]: undefined,
    [Screen.ONBOARDING]: undefined,
    [Screen.EXPLANATION]: undefined,
    [Screen.SETTING]: undefined,
    [Screen.INIT]: undefined,
    [Screen.FINISHED_THOUGHT]: {
        // TODO replace with thought-id
        thought: SavedThought,
    },
    [Screen.LOCK]: {
        isSettingCode: boolean,
    },
    [Screen.DEBUG]: undefined,
}

export type NavigationProp = NativeStackNavigationProp<ParamList>

export type ScreenProps<T extends keyof ParamList> = NativeStackScreenProps<ParamList, T>