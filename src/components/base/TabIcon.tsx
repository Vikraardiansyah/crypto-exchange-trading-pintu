import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface IBaseTabIcon {
  focused: boolean;
  color: string;
  size: number;
  activeIcon: string;
  inactiveIcon: string;
}

const TabIcon = ({
  focused,
  color,
  size,
  activeIcon,
  inactiveIcon,
}: IBaseTabIcon) => {
  return (
    <Icon
      name={focused ? activeIcon : inactiveIcon}
      size={size}
      color={color}
    />
  );
};

export default TabIcon;
