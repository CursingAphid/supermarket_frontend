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
import { translations } from '../utils/translations';

export type Language = 'nl' | 'en';

export interface I18nContextState {
  language: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLanguage: (language: Language) => Promise<void>;
}

const I18nContext = createContext<I18nContextState | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};

export const I18nProvider: React.FC<ProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (storedLanguage === 'nl' || storedLanguage === 'en') {
          setLanguageState(storedLanguage);
        }
      } catch (error) {
        console.warn('Failed to load language', error);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
    } catch (error) {
      console.warn('Failed to save language', error);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translation = translations[language]?.[key] || translations.nl[key] || key;
      
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(
            new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'),
            String(params[paramKey]),
          );
        });
      }
      
      return translation;
    },
    [language],
  );

  const contextValue = useMemo<I18nContextState>(
    () => ({
      language,
      t,
      setLanguage,
    }),
    [language, t, setLanguage],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextState => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
};

