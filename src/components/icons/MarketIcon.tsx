import React from 'react';
import TabIcon from '../base/TabIcon';
import {ITabIcon} from '../../types/icon';

const MarketIcon = (props: ITabIcon) => {
  return (
    <TabIcon
      activeIcon="bar-chart"
      inactiveIcon="bar-chart-outline"
      {...props}
    />
  );
};

export default MarketIcon;
