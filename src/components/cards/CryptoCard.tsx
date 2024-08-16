import React, {memo, useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CaretIcon from '../icons/CaretIcon';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ICryptoList} from '../../types/crypto';
import {NativeStackParamList} from '../../types/navigation';

import {formatIDR, formatPercentage} from '../../formats/textFormat';
import colors from '../../themes/colors';

const CryptoCard = ({
  item,
  newPrice,
}: {
  item: ICryptoList;
  newPrice: number;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParamList>>();

  const onPressCard = useCallback(() => {
    navigation.navigate('Detail', {
      item,
    });
  }, [item, navigation]);

  return (
    <Pressable
      style={({pressed}) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
      ]}
      onPress={onPressCard}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: item.image,
          }}
        />
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
          </View>
          <View style={styles.rightContent}>
            <Text style={styles.price}>
              {formatIDR(newPrice === 0 ? item.current_price : newPrice)}
            </Text>
            <View style={styles.percentage}>
              <CaretIcon
                size={16}
                direction={item.price_change_percentage_24h > 0 ? 'up' : 'down'}
              />
              <Text
                style={[
                  styles.percentageText,
                  item.price_change_percentage_24h > 0
                    ? styles.greenText
                    : styles.redText,
                ]}>
                {formatPercentage(item.price_change_percentage_24h)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: colors.container,
  },
  image: {
    height: 36,
    width: 36,
    borderRadius: 36 / 2,
    overflow: 'hidden',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  symbol: {
    flex: 1,
    color: colors.secondaryText,
  },
  price: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  percentage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    marginLeft: 6,
    fontWeight: '700',
  },
  redText: {
    color: colors.red,
  },
  greenText: {
    color: colors.green,
  },
});

export default memo(CryptoCard);
