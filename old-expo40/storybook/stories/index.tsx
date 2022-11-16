import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, Text, StatusBar } from 'react-native';

const style = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  backgroundColor: '#F5FCFF',
};

const CenteredView = ({ children }) => <View style={style}>{children}</View>;

storiesOf('ExampleView', module).add('default view', () => (
  <CenteredView>
    <Text>Hello Storybook</Text>
    <StatusBar hidden />
  </CenteredView>
));
