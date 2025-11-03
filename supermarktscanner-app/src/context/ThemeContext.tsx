import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export type Theme = 'light' | 'dark';

export interface ThemeContextState {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
}

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  error: string;
  success: string;
  warning: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBackground: string;
  inputBorder: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  cardBackground: string;
  cardShadow: string;
  drawerBackground: string;
  drawerHeaderBackground: string;
  mapBackground: string;
}

const lightColors: ThemeColors = {
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#e9ecef',
  primary: '#0d6efd',
  error: '#dc3545',
  success: '#198754',
  warning: '#856404',
  tabBar: '#ffffff',
  tabBarActive: '#0d6efd',
  tabBarInactive: '#6c757d',
  inputBackground: '#ffffff',
  inputBorder: '#ced4da',
  buttonPrimary: '#198754',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#0d6efd',
  buttonSecondaryText: '#ffffff',
  cardBackground: '#ffffff',
  cardShadow: '#000',
  drawerBackground: '#ffffff',
  drawerHeaderBackground: '#f8f9fa',
  mapBackground: '#f9fafb',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#333333',
  primary: '#4a9eff',
  error: '#ff5252',
  success: '#4caf50',
  warning: '#ffa726',
  tabBar: '#1e1e1e',
  tabBarActive: '#4a9eff',
  tabBarInactive: '#888888',
  inputBackground: '#2a2a2a',
  inputBorder: '#444444',
  buttonPrimary: '#4caf50',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#4a9eff',
  buttonSecondaryText: '#ffffff',
  cardBackground: '#2a2a2a',
  cardShadow: '#000',
  drawerBackground: '#1e1e1e',
  drawerHeaderBackground: '#2a2a2a',
  mapBackground: '#121212',
};

const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeState(storedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.warn('Failed to save theme', error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  }, [theme, setTheme]);

  const colors = useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);

  const contextValue = useMemo<ThemeContextState>(
    () => ({
      theme,
      colors,
      toggleTheme,
      setTheme,
    }),
    [theme, colors, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextState => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

