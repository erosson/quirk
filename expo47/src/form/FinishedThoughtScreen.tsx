import React from "react";
import { Container, Row, Header, IconButton } from "../ui";
import { View, StatusBar } from "react-native";
import theme from "../theme";
import Constants from "expo-constants";
import * as Haptic from "expo-haptics";
import i18n from "../i18n";
import FinishedThoughtView from "./FinishedThoughtView";
import { SavedThought } from "../thoughts";
import haptic from "../haptic";
import { Screen, ScreenProps} from "../screens";
import { Slides } from "./FormView";

type Props = ScreenProps<Screen.FINISHED_THOUGHT>

interface ScreenState {
  thought: SavedThought;
}

export default class extends React.Component<Props, ScreenState> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      thought: this.props.route.params.thought,
    };
  }

  onEdit = (_: string, slide: Slides) => {
    this.props.navigation.push(Screen.CBT_FORM, {
      thought: this.state.thought,
      slide,
    });
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: theme.lightOffwhite,
          height: "100%",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <Container
          style={{
            height: "100%",
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: Constants.statusBarHeight,
            paddingTop: 12,
          }}
        >
          <Row
            style={{
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <Header allowFontScaling={false}>
              {i18n.t("finished_screen.header")}
            </Header>
            <IconButton
              accessibilityLabel={i18n.t("accessibility.close_button")}
              featherIconName={"x"}
              onPress={() => {
                haptic.impact(Haptic.ImpactFeedbackStyle.Light);
                this.props.navigation.push(Screen.CBT_FORM, {
                  clear: true,
                });
              }}
            />
          </Row>

          <FinishedThoughtView
            thought={this.state.thought}
            onEdit={this.onEdit}
            onNew={() => {
              haptic.impact(Haptic.ImpactFeedbackStyle.Light);
              this.props.navigation.push(Screen.CBT_FORM, {
                clear: true,
              });
            }}
          />
        </Container>
      </View>
    );
  }
}
