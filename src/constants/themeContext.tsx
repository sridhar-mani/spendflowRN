import React, {createContext, useContext, useEffect, useState} from 'react';
import {Colors} from 'react-native-ui-lib';
import useStore from '../store';

// Define theme colors
const lightTheme = {
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  text: '#1A1A1A',
  textSecondary: '#757575',
  primary: '#667eea',
  secondary: '#4299E1',
  accent: '#00D2D3',
  border: '#E0E0E0',
  error: '#FF5252',
  warning: '#FFA000',
  success: '#4CAF50',
  cardBackground: '#FFFFFF',
  headerBackground: '#667eea',
  tabBarBackground: '#FFFFFF',
  expenseColor: '#c62828',
  incomeColor: '#2e7d32',
  investmentColor: '#f57c00',
  savingsColor: '#1976d2',
};

const darkTheme = {
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#7B91FF',
  secondary: '#63B3ED',
  accent: '#20E0E0',
  border: '#333333',
  error: '#FF6B6B',
  warning: '#FFB74D',
  success: '#66BB6A',
  cardBackground: '#1E1E1E',
  headerBackground: '#222639',
  tabBarBackground: '#121212',
  expenseColor: '#ff5f52',
  incomeColor: '#66bb6a',
  investmentColor: '#ffb74d',
  savingsColor: '#64b5f6',
};

// Create the context
export const ThemeContext = createContext({
  isDarkMode: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

// Hook for easy access to the theme
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const {settings} = useStore() as any;
  const [isDarkMode, setIsDarkMode] = useState(settings?.darkMode || false);

  // Effect to update UI lib colors
  useEffect(() => {
    // Update when the theme changes or on initial load
    const theme = isDarkMode ? darkTheme : lightTheme;
    
    // Configure UI lib colors
    Colors.loadColors({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      textPrimary: theme.text,
      textSecondary: theme.textSecondary,
      backgroundPrimary: theme.background,
      backgroundSecondary: theme.backgroundSecondary,
      error: theme.error,
      success: theme.success,
      warning: theme.warning,
    });
    
    // Configure status bar style
    // You would use React Native's StatusBar component in App.tsx to apply this
  }, [isDarkMode]);

  // Effect to listen for theme changes from settings
  useEffect(() => {
    setIsDarkMode(settings?.darkMode || false);
  }, [settings?.darkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{isDarkMode, theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
