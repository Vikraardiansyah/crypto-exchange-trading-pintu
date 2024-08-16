import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../themes/colors';

const CaretIcon = ({
  direction,
  size,
}: {
  direction: 'up' | 'down';
  size: number;
}) => {
  return (
    <Icon
      name={direction === 'up' ? 'caret-up-outline' : 'caret-down-outline'}
      size={size}
      color={direction === 'up' ? colors.green : colors.red}
    />
  );
};

export default CaretIcon;
