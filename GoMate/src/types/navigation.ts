import { BusStop } from "./index";

export type RootStackParamList = {
  MainTabs: undefined;
  Details: { stop: BusStop };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favourites: undefined;
  Settings: undefined;
};
