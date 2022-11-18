import React from "react";
import { View } from "react-native";
import { hasPincode } from "./lock/lockstore";
import { Screen, ScreenProps} from "./screens";

type Props = ScreenProps<Screen.INIT>

export default class InitScreen extends React.Component<Props, {}> {
  async componentDidMount() {
    this.redirectToFormScreen();
  }

  async redirectToFormScreen() {
    // If we're locked, go to the lock instead
    // Check if we should show a pincode
    const isLocked = await hasPincode();
    if (isLocked) {
      this.props.navigation.replace(Screen.LOCK, {isSettingCode: false});
      return;
    }

    // We replace here because you shouldn't be able to go "back" to this screen
    this.props.navigation.replace(Screen.CBT_FORM, {
      clear: true,
    });
  }

  render() {
    return <View />;
  }
}
