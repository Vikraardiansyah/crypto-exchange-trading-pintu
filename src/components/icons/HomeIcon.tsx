import React from 'react';
import TabIcon from '../base/TabIcon';
import {ITabIcon} from '../../types/icon';

const HomeIcon = (props: ITabIcon) => {
  return <TabIcon activeIcon="home" inactiveIcon="home-outline" {...props} />;
};

export default HomeIcon;
