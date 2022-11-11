module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  transformIgnorePatterns: [
    // (some?) transformed modules must be listed explicitly. this line is from the
    // docs below, with a few extra modules specific to this project added at the end:
    // https://docs.expo.io/guides/testing-with-jest/#jest-configuration
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-pose-core|animated-pose)",
  ],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  globals: {
    "ts-jest": {
      // diagnostics: false,
      tsconfig: {
        jsx: "react",
      },
    },
  },
  "setupFiles": ["./src/jestSetup.js"],
};
