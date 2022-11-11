// https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('@react-native-community/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
