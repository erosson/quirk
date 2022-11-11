import initStoryshots from "@storybook/addon-storyshots";

// Various mocks for quieter logging during tests:
//
// * Quiet, StatusBar
jest.useFakeTimers();

// * Quiet, posed. Thanks, https://stackoverflow.com/a/59593847
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

initStoryshots();
