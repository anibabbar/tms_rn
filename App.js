import 'react-native-gesture-handler';
import React from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import MainNavigator from './src/router';
import RootComponent from './src/components/RootComponent';
import configureStore from './src/store/configureStore';
import { Provider } from 'react-redux';

const App: () => Node = () => {

  const store = configureStore()
  
  return (
    <Provider store={store}>
      <View style={styles.containert}>
        <RootComponent>
          <MainNavigator />
        </RootComponent>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  containert: {
    flex: 1
  },
});

export default App;