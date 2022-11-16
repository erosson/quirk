/**
 * Feature flags. Enable/disable parts of the app.
 *
 * These are viewed - and changed - via the secret debug screen. On the settings
 * screen, at the bottom, tap the blank space 5 times.
 *
 * These flags are stored in-memory. Changes are lost when the app restarts.
 *
 * Usage:
 * - Anywhere in the app that depends on a feature flag:
 *
 *     function MyComponent(props) {
 *       const {feature, updateFeature} = useContext(Feature.Context);
 *       return (
 *         // render component
 *       );
 *     }
 *
 *   or
 *
 *     <Feature.Context.Consumer>
 *     {({feature, updateFeature} =>
 *       // render component
 *     )}
 *     </Feature.Context.Consumer>
 *
 * - At the top level of the app:
 *
 *     Feature.withState(AppComponent)
 *
 *   or
 *
 *     <Feature.State>
 *       <AppComponent />
 *     </Feature.State>
 */
import React from "react";
import { Platform } from "react-native";

export interface Feature {
  debugVisible: boolean;
  reminders: boolean;
  remindersEachMinute: boolean;
  localeSetting: boolean;
  testLocalesVisible: boolean;
}
export const defaults: Feature = {
  debugVisible: false,
  reminders: Platform.OS === "ios",
  remindersEachMinute: false,
  localeSetting: true,
  testLocalesVisible: false,
};

export const Context = React.createContext({
  feature: defaults,
  updateFeature: (action: object) => undefined,
});

export const State = ({ children }: React.PropsWithChildren<{}>) => {
  const [feature, updateFeature] = React.useReducer(
    (state, newState) => ({ ...state, ...newState }),
    defaults
  );
  return (
    <Context.Provider value={{ feature, updateFeature }}>
      {children}
    </Context.Provider>
  );
};
export function withState(Component) {
  return () => (
    <State>
      <Component />
    </State>
  );
}
