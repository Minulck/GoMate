import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Heart, Home, Settings } from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { checkAuthStatus } from "../redux/slices/authSlice";

// Import screens
import DetailsScreen from "../screens/DetailsScreen";
import FavouritesScreen from "../screens/FavouritesScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (for authenticated users)
const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home width={size} height={size} stroke={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Heart width={size} height={size} stroke={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings width={size} height={size} stroke={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack (for non-authenticated users)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Stack (includes tabs and detail screens)
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, []);

  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;
