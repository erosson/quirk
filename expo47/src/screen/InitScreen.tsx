import React from "react"
import { View } from "react-native"
import { hasPincode } from "../lockstore"
import { Screen, ScreenProps, NavigationProp } from "../screens"

type Props = ScreenProps<Screen.INIT>

async function redirectToFormScreen(navigation: NavigationProp): Promise<void> {
  // If we're locked, go to the lock instead
  // Check if we should show a pincode
  const isLocked = await hasPincode()
  if (isLocked) {
    navigation.replace(Screen.LOCK, { isSettingCode: false })
    return
  }

  // We replace here because you shouldn't be able to go "back" to this screen
  navigation.replace(Screen.CBT_FORM, {
    clear: true,
  })
}

export default function InitScreen(props: Props): JSX.Element {
  React.useEffect(() => {
    redirectToFormScreen(props.navigation)
  })

  return <View />
}