import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import {useCoinGeckoApiFetch} from '../networks/coinGeckoApiFetch';
import {useCurrencyApiFetch} from '../networks/currencyApiFetch';

import LoadingIndicator from '../components/loading/LoadingIndicator';
import CryptoCard from '../components/cards/CryptoCard';

import {
  ICryptoList,
  IIDRCurrency,
  IResponseRealtimeOHLCV,
} from '../types/crypto';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabStackParamList} from '../types/navigation';
import {
  ada,
  BINGX_SPOT_BTC_USDC,
  BITEXLIVE_SPOT_DOGE_USDT,
  BITGETFTS_PERP_ADA_USD,
  bnb,
  btc,
  BYBIT_FTS_ETH_USD_240927,
  BYBITSPOT_SPOT_SOL_USDT,
  DERIBIT_IDX_STETH_USD,
  doge,
  eth,
  MEXC_SPOT_TON_USDT,
  OKEX_IDX_BNB_USDT,
  POLONIEX_SPOT_XRP_USDT,
  sol,
  steth,
  ton,
  xrp,
} from '../constants/symbolId';
import {COIN_GECKO_MARKET} from '../constants/coinGeckoApi';
import {COIN_GECKO_MARKET_KEY, CURRENCY_KEY} from '../constants/apiFetchKey';

import colors from '../themes/colors';
import ForwardIcon from '../components/icons/ForwardIcon';
import texts from '../themes/texts';

const CryptoMarketPage = ({
  navigation,
  isFromHomePage,
}: {
  navigation: BottomTabNavigationProp<TabStackParamList>;
  isFromHomePage?: boolean;
}) => {
  const [currentPrice, setCurrentPrice] = useState({
    btc: 0,
    eth: 0,
    bnb: 0,
    doge: 0,
    ada: 0,
    sol: 0,
    xrp: 0,
    steth: 0,
    ton: 0,
  });

  const {data: dataMarket, isLoading: isLoadingMarket} = useCoinGeckoApiFetch<
    ICryptoList[]
  >(COIN_GECKO_MARKET_KEY, COIN_GECKO_MARKET, {
    vs_currency: 'idr',
  });

  const {data: dataCurrency} = useCurrencyApiFetch<IIDRCurrency>(
    CURRENCY_KEY,
    '',
    {
      base_currency: 'USD',
      currencies: 'IDR',
    },
  );

  const filterredDataMarket = useMemo(() => {
    if (isFromHomePage) {
      return dataMarket?.filter(item => {
        const topCoinList = [btc, eth, bnb, doge, ada, sol, xrp, steth, ton];
        if (topCoinList.includes(item.symbol)) {
          return item;
        }
        return null;
      });
    }
    return dataMarket;
  }, [dataMarket, isFromHomePage]);

  const currencyIDR = useMemo(
    () => dataCurrency?.data.IDR.value,
    [dataCurrency],
  );

  const handleWsOnMessage = useCallback(
    (e: WebSocketMessageEvent) => {
      let data;
      try {
        data = JSON.parse(e.data) as IResponseRealtimeOHLCV;
        console.log(data);
      } catch (error) {
        data;
      }
      if (currencyIDR && data) {
        switch (data.symbol_id) {
          case BINGX_SPOT_BTC_USDC:
            setCurrentPrice({
              ...currentPrice,
              btc: data.price_open * currencyIDR,
            });
            break;
          case BYBIT_FTS_ETH_USD_240927:
            setCurrentPrice({
              ...currentPrice,
              eth: data.price_open * currencyIDR,
            });
            break;
          case OKEX_IDX_BNB_USDT:
            setCurrentPrice({
              ...currentPrice,
              bnb: data.price_open * currencyIDR,
            });
            break;
          case BITEXLIVE_SPOT_DOGE_USDT:
            setCurrentPrice({
              ...currentPrice,
              doge: data.price_open * currencyIDR,
            });
            break;
          case BITGETFTS_PERP_ADA_USD:
            setCurrentPrice({
              ...currentPrice,
              ada: data.price_open * currencyIDR,
            });
            break;
          case BYBITSPOT_SPOT_SOL_USDT:
            setCurrentPrice({
              ...currentPrice,
              sol: data.price_open * currencyIDR,
            });
            break;
          case POLONIEX_SPOT_XRP_USDT:
            setCurrentPrice({
              ...currentPrice,
              xrp: data.price_open * currencyIDR,
            });
            break;
          case DERIBIT_IDX_STETH_USD:
            setCurrentPrice({
              ...currentPrice,
              steth: data.price_open * currencyIDR,
            });
            break;
          case MEXC_SPOT_TON_USDT:
            setCurrentPrice({
              ...currentPrice,
              ton: data.price_open * currencyIDR,
            });
            break;
        }
      }
    },
    [currencyIDR, currentPrice],
  );

  useEffect(
    function websocket() {
      const ws = new WebSocket(process.env.COIN_API_WEBSOCKET_URL as string);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'subscribe',
            apikey: process.env.COIN_API_API_KEY,
            heartbeat: false,
            subscribe_data_type: ['ohlcv'],
            subscribe_filter_period_id: ['20SEC'],
            subscribe_filter_symbol_id: [
              `${BINGX_SPOT_BTC_USDC}$`,
              `${BITEXLIVE_SPOT_DOGE_USDT}$`,
              `${BITGETFTS_PERP_ADA_USD}$`,
              `${BYBIT_FTS_ETH_USD_240927}$`,
              `${OKEX_IDX_BNB_USDT}$`,
              `${BYBITSPOT_SPOT_SOL_USDT}$`,
              `${POLONIEX_SPOT_XRP_USDT}$`,
              `${DERIBIT_IDX_STETH_USD}$`,
              `${MEXC_SPOT_TON_USDT}$`,
            ],
          }),
        );
      };

      ws.onmessage = handleWsOnMessage;

      return () => {
        ws.close();
      };
    },
    [currentPrice, currencyIDR, handleWsOnMessage],
  );

  const SeeMarketTextButton = useCallback(() => {
    return (
      <Pressable
        style={({pressed}) => [
          styles.headerRight,
          {opacity: pressed ? 0.6 : 1},
        ]}
        onPress={() => navigation.navigate('Markets')}>
        <Text style={styles.headerRightText}>{texts.seeAllAssets}</Text>
        <ForwardIcon />
      </Pressable>
    );
  }, [navigation]);

  useEffect(() => {
    if (isFromHomePage) {
      navigation.setOptions({
        headerRight: SeeMarketTextButton,
      });
    }
  }, [SeeMarketTextButton, isFromHomePage, navigation]);

  const renderItem = useCallback(
    ({item, index}: {item: ICryptoList; index: number}) => {
      function getNewPrice() {
        switch (item.symbol) {
          case btc:
            return currentPrice.btc;
          case eth:
            return currentPrice.eth;
          case bnb:
            return currentPrice.bnb;
          case doge:
            return currentPrice.doge;
          case ada:
            return currentPrice.ada;
          case sol:
            return currentPrice.sol;
          case xrp:
            return currentPrice.xrp;
          case steth:
            return currentPrice.steth;
          case ton:
            return currentPrice.ton;
          default:
            return 0;
        }
      }
      const newPrice = getNewPrice();

      return (
        <CryptoCard
          key={`crypto_card_${index}`}
          newPrice={newPrice}
          item={item}
        />
      );
    },
    [currentPrice],
  );

  if (isLoadingMarket || !filterredDataMarket) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filterredDataMarket}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  headerRightText: {
    marginRight: 4,
  },
  seeMarketContent: {
    backgroundColor: 'red',
  },
});

export default CryptoMarketPage;
