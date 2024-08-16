import useSWR, {Fetcher} from 'swr';

const optionsCoinGecko = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.COIN_GECKO_API_KEY as string,
  },
};

export function useCoinGeckoApiFetch<T>(
  key: string,
  urlPath: string,
  params: object,
) {
  const queryParams = new URLSearchParams(params as URLSearchParams).toString();
  const fetcher: Fetcher<T> = () =>
    fetch(
      `${process.env.COIN_GECKO_BASE_URL as string}${urlPath}?${queryParams}`,
      optionsCoinGecko,
    ).then(response => response.json());
  const response = useSWR<T>(key, fetcher);
  return response;
}
