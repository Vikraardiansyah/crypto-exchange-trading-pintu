import React from 'react';
import {
  AppState,
  AppStateStatus,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {addEventListener} from '@react-native-community/netinfo';

import {NativeStackParamList, TabStackParamList} from './src/types/navigation';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SWRConfig} from 'swr';
import CryptoMarketPage from './src/pages/CryptoMarketPage';
import CryptoDetailPage from './src/pages/CryptoDetailPage';
import HomeIcon from './src/components/icons/HomeIcon';
import MarketIcon from './src/components/icons/MarketIcon';

import colors from './src/themes/colors';
import HomePage from './src/pages/HomePage';

const isAndroid = Platform.OS === 'android';

const Stack = createNativeStackNavigator<NativeStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

const HomeTabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.black,
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {
          marginTop: 8,
          marginBottom: isAndroid ? 8 : undefined,
        },
        tabBarStyle: {height: isAndroid ? 66 : 84},
      }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerTitle: 'Top Coins',
          headerTitleStyle: {fontSize: 20},
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Markets"
        component={CryptoMarketPage}
        options={{
          tabBarIcon: MarketIcon,
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 20},
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

const RootScene = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTab"
          component={HomeTabScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail"
          component={CryptoDetailPage}
          options={{
            headerBackTitleVisible: false,
            headerBackButtonMenuEnabled: false,
            headerTintColor: colors.black,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SWRConfig
        value={{
          provider: () => new Map(),
          isVisible: () => {
            return true;
          },
          initFocus(callback) {
            let appState = AppState.currentState;

            const onAppStateChange = (nextAppState: AppStateStatus) => {
              if (
                appState.match(/inactive|background/) &&
                nextAppState === 'active'
              ) {
                callback();
              }
              appState = nextAppState;
            };

            const subscription = AppState.addEventListener(
              'change',
              onAppStateChange,
            );

            return () => {
              subscription.remove();
            };
          },
          initReconnect(callback) {
            const unsubscribe = addEventListener(state => {
              if (state.isConnected) {
                callback();
              }
            });

            unsubscribe();
          },
        }}>
        <RootScene />
      </SWRConfig>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
});

export default App;
