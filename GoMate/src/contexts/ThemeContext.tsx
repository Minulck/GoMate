import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper } from "../utils/asyncStorage";

const THEME_KEY = "app_theme";

export const lightTheme = {
  primary: "#0a7ea4",
  background: "#fff",
  surface: "#f8f9fa",
  text: "#11181C",
  textSecondary: "#687076",
  textLight: "#9BA1A6",
  border: "#e1e5e9",
  danger: "#dc3545",
  error: "#dc3545",
  warning: "#ffc107",
  success: "#28a745",
};

export const darkTheme = {
  primary: "#0a7ea4",
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textLight: "#808080",
  border: "#2d2d2d",
  danger: "#ff6b6b",
  error: "#ff6b6b",
  warning: "#ffd93d",
  success: "#6bcf7f",
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: lightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorageWrapper.getItem(THEME_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorageWrapper.setItem(THEME_KEY, newTheme ? "dark" : "light");
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
