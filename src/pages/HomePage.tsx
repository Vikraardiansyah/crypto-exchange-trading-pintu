import React from 'react';
import CryptoMarketPage from './CryptoMarketPage';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../types/navigation';

const HomePage = (
  props: React.JSX.IntrinsicAttributes & {
    navigation: BottomTabNavigationProp<TabStackParamList>;
  },
) => {
  return <CryptoMarketPage isFromHomePage {...props} />;
};

export default HomePage;
