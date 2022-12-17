import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { Slides } from "./form/FormView"
import { ID as ThoughtID } from "./io-ts/thought"

export const enum Screen {
  CBT_FORM = "CBT_FORM_SCREEN",
  CBT_LIST = "CBT_LIST_SCREEN",
  ONBOARDING = "ONBOARDING_SCREEN",
  EXPLANATION = "EXPLANATION_SCREEN",
  SETTING = "SETTING_SCREEN",
  INIT = "INIT_SCREEN",
  CBT_VIEW = "CBT_VIEW_SCREEN",
  LOCK = "LOCK_SCREEN",
  DEBUG = "DEBUG_SCREEN",
  BACKUP = "BACKUP_SCREEN",
}

export type ParamList = {
  [Screen.CBT_FORM]:
    | {
        fromOnboarding?: boolean
        thoughtID?: ThoughtID
        slide?: Slides
      }
    | undefined
  [Screen.CBT_LIST]: undefined
  [Screen.ONBOARDING]: undefined
  [Screen.EXPLANATION]: undefined
  [Screen.SETTING]: undefined
  [Screen.INIT]: undefined
  [Screen.CBT_VIEW]: {
    thoughtID: ThoughtID
  }
  [Screen.LOCK]: {
    isSettingCode: boolean
  }
  [Screen.DEBUG]: undefined
  [Screen.BACKUP]: undefined
}

export type NavigationProp = NativeStackNavigationProp<ParamList>

export type ScreenProps<T extends keyof ParamList> = NativeStackScreenProps<
  ParamList,
  T
>
