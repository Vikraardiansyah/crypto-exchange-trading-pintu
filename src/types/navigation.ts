import {ICryptoList} from './crypto';

export type NativeStackParamList = {
  HomeTab: undefined;
  Detail: {item: ICryptoList};
};

export type TabStackParamList = {
  Home: undefined;
  Markets: undefined;
};
