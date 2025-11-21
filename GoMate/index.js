import { registerRootComponent } from "expo";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./redux/store";
import AppNavigator from "./app/AppNavigator";

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </Provider>
);

registerRootComponent(App);
