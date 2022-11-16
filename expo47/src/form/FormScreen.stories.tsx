import React from "react";
import { StatusBar } from "react-native";
import { storiesOf } from "@storybook/react-native";
import * as Knobs from "@storybook/addon-knobs";
import FormScreen from "./FormScreen";
import i18n from "../i18n";

const mockNavigation = {
  addListener: () => undefined,
  getParam: (key, default_) => default_,
  push: () => undefined,
  replace: () => undefined,
};

const stories = storiesOf("FormScreen", module)
  .addDecorator((Story) => Story({ navigation: mockNavigation } as any))
  .addDecorator(Knobs.withKnobs);

stories.add("1/automatic", (props) => {
  i18n.locale = Knobs.select("locale", Object.keys(i18n.translations), "en");
  return (
    <>
      <FormScreen {...props} slideToShow={"automatic"} />
      <StatusBar hidden />
    </>
  );
});
stories.add("2/distortions", (props) => {
  i18n.locale = Knobs.select("locale", Object.keys(i18n.translations), "en");
  return (
    <>
      <FormScreen {...props} slideToShow={"distortions"} />
      <StatusBar hidden />
    </>
  );
});
stories.add("3/challenge", (props) => {
  i18n.locale = Knobs.select("locale", Object.keys(i18n.translations), "en");
  return (
    <>
      <FormScreen {...props} slideToShow={"challenge"} />
      <StatusBar hidden />
    </>
  );
});
stories.add("4/alternative", (props) => {
  i18n.locale = Knobs.select("locale", Object.keys(i18n.translations), "en");
  return (
    <>
      <FormScreen {...props} slideToShow={"alternative"} />
      <StatusBar hidden />
    </>
  );
});
