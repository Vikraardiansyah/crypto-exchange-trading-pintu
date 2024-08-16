import {TLineChartPoint} from 'react-native-wagmi-charts';

export function convertPriceArrayToObject(prices: number[][]) {
  const newArray = Array(prices.length)
    .fill(undefined)
    .map((_, i) => {
      const myObj: TLineChartPoint = {
        timestamp: 0,
        value: 0,
      };
      Object.keys(myObj).forEach(
        (v, j) => (myObj[v as 'timestamp' | 'value'] = prices[i][j]),
      );
      return myObj;
    });

  return newArray;
}

export function getLowHighPrice(prices: TLineChartPoint[]) {
  const priceList = prices.map(({value}) => value);

  const lowPrice = Math.min(...priceList);
  const highPrice = Math.max(...priceList);
  const lowPriceIndex = priceList.indexOf(Math.min(...priceList));
  const highPriceIndex = priceList.indexOf(Math.max(...priceList));

  return {lowPrice, lowPriceIndex, highPrice, highPriceIndex};
}
