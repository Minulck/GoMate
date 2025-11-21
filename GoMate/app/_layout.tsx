import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";

import { store } from "../redux/store";
import AppNavigator from "./AppNavigator";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
