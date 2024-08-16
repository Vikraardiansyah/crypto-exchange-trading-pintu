import useSWR from 'swr';

const optionsCurrency = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    apikey: process.env.CURRENCY_API_KEY as string,
  },
};

export function useCurrencyApiFetch<T>(
  key: string,
  urlPath: string,
  params: object,
) {
  const queryParams = new URLSearchParams(params as URLSearchParams).toString();
  const fetcher = () =>
    fetch(
      `${process.env.CURRENCY_BASE_URL as string}${urlPath}?${queryParams}`,
      optionsCurrency,
    ).then(response => response.json());
  const response = useSWR<T>(key, fetcher);
  return response;
}
