import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {runOnJS, useSharedValue} from 'react-native-reanimated';
import dayjs from 'dayjs';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackParamList} from '../types/navigation';

import {LineChart} from 'react-native-wagmi-charts';

import {convertPriceArrayToObject, getLowHighPrice} from '../types/chart';
import {formatIDR, formatPercentage} from '../formats/textFormat';
import colors from '../themes/colors';
import texts from '../themes/texts';
import CaretIcon from '../components/icons/CaretIcon';
import {useCoinGeckoApiFetch} from '../networks/coinGeckoApiFetch';
import {ICryptoChart} from '../types/crypto';
import {COIN_GECKO_MARKET_CHART_KEY} from '../constants/apiFetchKey';
import LoadingIndicator from '../components/loading/LoadingIndicator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isAndroid = Platform.OS === 'android';

type ICryptoDetailPage = NativeStackScreenProps<NativeStackParamList, 'Detail'>;

const TIME_RANGE_LIST = [texts.aDay, texts.aWeek, texts.aMonth, texts.aYear];

const CryptoDetailPage = ({route, navigation}: ICryptoDetailPage) => {
  const {name: coinName, id: coinId} = route.params.item;

  const [days, setDays] = useState(1);
  const [timeRangeIndex, setTimeRangeIndex] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);

  const {data: dataChart, isLoading} = useCoinGeckoApiFetch<ICryptoChart>(
    `${COIN_GECKO_MARKET_CHART_KEY}_${coinName}_${days}`,
    `coins/${coinId}/market_chart`,
    {
      vs_currency: 'idr',
      days,
    },
  );

  const priceList = useMemo(() => {
    if (dataChart?.prices) {
      return convertPriceArrayToObject(dataChart?.prices);
    }
    return [
      {
        timestamp: 0,
        value: 0,
      },
    ];
  }, [dataChart?.prices]);

  const priceLastIndex = useMemo(() => priceList.length - 1, [priceList]);

  const firstPrice = useMemo(() => priceList[0].value, [priceList]);
  const lastPrice = useMemo(
    () => priceList[priceLastIndex].value,
    [priceLastIndex, priceList],
  );
  const lastPriceIDR = useMemo(() => formatIDR(lastPrice), [lastPrice]);
  const {lowPrice, lowPriceIndex, highPrice, highPriceIndex} = useMemo(
    () => getLowHighPrice(priceList),
    [priceList],
  );

  const lowPriceIDR = useMemo(() => formatIDR(lowPrice), [lowPrice]);
  const highPriceIDR = useMemo(() => formatIDR(highPrice), [highPrice]);

  const differencePrice = useMemo(
    () => firstPrice - lastPrice,
    [firstPrice, lastPrice],
  );

  const itemPercentage = useMemo(() => {
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  }, [firstPrice, lastPrice]);

  const price = useSharedValue(lastPriceIDR);
  const time = useSharedValue('');
  const [percentage, setPercentage] = useState(itemPercentage);

  const chartColor = useMemo(() => {
    return differencePrice > 0 ? colors.redChart : colors.greenChart;
  }, [differencePrice]);
  const positifPercentage = useMemo(() => {
    return percentage > 0;
  }, [percentage]);

  useEffect(
    function handleHeaderTitle() {
      navigation.setOptions({headerTitle: coinName});
    },
    [coinName, navigation],
  );

  useEffect(
    function setDaysChart() {
      switch (timeRangeIndex) {
        case 0:
          setDays(1);
          break;
        case 1:
          setDays(7);
          break;
        case 2:
          setDays(30);
          break;
        case 3:
          setDays(365);
          break;
        default:
          setDays(1);
          break;
      }
    },
    [timeRangeIndex],
  );

  const handleTimeRange = useCallback((index: number) => {
    setTimeRangeIndex(index);
  }, []);

  const onCursorActive = useCallback(() => {
    setCursorActive(true);
  }, []);

  const onCursorEnded = useCallback(() => {
    setCursorActive(false);
  }, []);

  const handlePriceFormat = useCallback(
    (currentPrice: string) => {
      if (currentPrice) {
        const numberCurrentPrice = Number(currentPrice);
        const currentPriceIDR = formatIDR(numberCurrentPrice);
        const newPercentage =
          ((numberCurrentPrice - firstPrice) / firstPrice) * 100;
        price.value = currentPriceIDR;
        setPercentage(newPercentage);
      } else {
        price.value = lastPriceIDR;
        setPercentage(itemPercentage);
      }
    },
    [firstPrice, itemPercentage, lastPriceIDR, price],
  );

  const handleTimeFormat = useCallback(
    (unixTime: number) => {
      if (unixTime > 0) {
        const formattedTime = dayjs(unixTime).format('D MMMM YYYY HH:mm');
        time.value = formattedTime;
      } else {
        time.value = `${coinName} ${texts.price}`;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coinName],
  );

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <LoadingIndicator style={styles.loadingIndicator} />
      ) : (
        <LineChart.Provider data={priceList}>
          {cursorActive ? (
            <LineChart.DatetimeText
              style={
                isAndroid ? styles.androidDateTimeText : styles.dateTimeText
              }
              format={({value}) => {
                'worklet';
                runOnJS(handleTimeFormat)(value);
                return time.value;
              }}
            />
          ) : (
            <Text
              style={styles.dateTimeText}>{`${coinName} ${texts.price}`}</Text>
          )}
          <View style={styles.priceContent}>
            {cursorActive ? (
              <LineChart.PriceText
                style={isAndroid ? styles.androidPriceText : styles.priceText}
                format={({value}) => {
                  'worklet';
                  runOnJS(handlePriceFormat)(value);
                  return price.value;
                }}
              />
            ) : (
              <Text style={styles.priceText}>{lastPriceIDR}</Text>
            )}
            <View style={[styles.percentageContent]}>
              <CaretIcon
                direction={positifPercentage ? 'up' : 'down'}
                size={28}
              />
              <Text
                style={[
                  styles.percentageText,
                  positifPercentage ? styles.green : styles.red,
                ]}>
                {formatPercentage(percentage)}
              </Text>
            </View>
          </View>
          <LineChart
            height={screenHeight / 3}
            width={screenWidth - 16}
            style={styles.lineChart}>
            <LineChart.Path width={2} color={chartColor}>
              <LineChart.Dot
                size={5}
                color={chartColor}
                at={priceLastIndex}
                inactiveColor="transparent"
                hasPulse
              />
              <LineChart.Tooltip
                yGutter={-12}
                at={highPriceIndex}
                position="top">
                <Text style={styles.secondaryText}>{highPriceIDR}</Text>
              </LineChart.Tooltip>
              <LineChart.Tooltip
                yGutter={-12}
                at={lowPriceIndex}
                position="bottom">
                <Text style={styles.secondaryText}>{lowPriceIDR}</Text>
              </LineChart.Tooltip>
            </LineChart.Path>
            <LineChart.CursorCrosshair
              onActivated={onCursorActive}
              onEnded={onCursorEnded}
              color={chartColor}
              size={10}
            />
          </LineChart>
        </LineChart.Provider>
      )}
      <View style={styles.timeContainer}>
        {TIME_RANGE_LIST.map((value, index) => (
          <Pressable
            key={`time_button_${index}`}
            style={[
              styles.timeButton,
              index === timeRangeIndex ? styles.bgBlue : undefined,
            ]}
            onPress={() => handleTimeRange(index)}>
            <Text
              style={[
                styles.timeText,
                index === timeRangeIndex ? styles.activeText : undefined,
              ]}>
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  secondaryText: {
    color: colors.secondaryText,
  },
  androidDateTimeText: {
    marginLeft: 16,
    color: colors.secondaryText,
  },
  dateTimeText: {
    marginTop: 16,
    marginLeft: 16,
    color: colors.secondaryText,
  },
  priceContent: {
    flexDirection: 'row',
  },
  androidPriceText: {
    marginVertical: -30,
    marginLeft: 16,
    fontSize: 30,
    fontWeight: 'bold',
  },
  priceText: {
    marginLeft: 16,
    fontSize: 30,
    fontWeight: 'bold',
  },
  percentageContent: {
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    flex: 1,
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  lineChart: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  timeButton: {
    borderRadius: 4,
    paddingVertical: 8,
    width: 60,
  },
  bgBlue: {
    backgroundColor: colors.blue,
  },
  timeText: {
    textAlign: 'center',
  },
  activeText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight / 3,
  },
  greenChart: {
    color: colors.greenChart,
  },
  redChart: {
    color: colors.redChart,
  },
  green: {
    color: colors.green,
  },
  red: {
    color: colors.redChart,
  },
});

export default CryptoDetailPage;
