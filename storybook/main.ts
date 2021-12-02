import AsyncStorage from "@react-native-community/async-storage";
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories');
  require('../src/form/FormScreen.stories');
  require('../src/DebugScreen.stories');
}, module);

// https://github.com/storybookjs/storybook/tree/master/app/react-native#getstorybookui-options
const StorybookUIRoot = (() => {
  try {
    return getStorybookUI({
      // @ts-ignore: I'm just following the docs leave me alone
      asyncStorage: AsyncStorage,
      isUIHidden: true,
      // onDeviceUI: false,
    });
  }
  catch (e) {
    if (e.name === 'TypeError') {
      // during test runs/storyshots for some reason; tests still work
      return null;
    }
    else {
      throw e;
    }
  }
})();

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
// AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
