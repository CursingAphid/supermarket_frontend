import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchProducts } from '../services/api';
import { Product } from '../types';
import { ProductList } from '../components/ProductList';
import { useLocationContext } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { DEFAULT_SEARCH_KEYWORD } from '../utils/constants';

export const ProductSearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { location, radiusKm } = useLocationContext();
  const [keyword, setKeyword] = useState<string>(DEFAULT_SEARCH_KEYWORD);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const runSearch = useCallback(
    async (searchKeyword: string, { skipLocationCheck = false } = {}) => {
      if (!searchKeyword.trim()) {
        Alert.alert(t('search.keywordRequired'), t('search.keywordRequiredMessage'));
        return;
      }

      if (!skipLocationCheck && !location) {
        Alert.alert(t('search.locationRequired'), t('search.locationRequiredMessage'));
        return;
      }

      try {
        setIsLoading(true);
        const response = await searchProducts(
          searchKeyword.trim(),
          location?.latitude,
          location?.longitude,
          radiusKm,
        );
        setProducts(response.products || []);
        setCount(response.count);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('search.error');
        Alert.alert(t('general.errorTitle'), message);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [location, radiusKm, t],
  );

  useEffect(() => {
    if (location) {
      runSearch(DEFAULT_SEARCH_KEYWORD, { skipLocationCheck: true }).catch((error) => {
        console.warn('Initial product search failed', error);
      });
    }
  }, [location, runSearch]);

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    runSearch(keyword).catch((error) => {
      console.warn('Product search failed', error);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    runSearch(keyword).catch((error) => {
      console.warn('Product refresh failed', error);
    });
  };

  if (!location) {
    return (
      <View style={[styles(colors).centered, { backgroundColor: colors.background }]}>
        <Text style={[styles(colors).notice, { color: colors.textSecondary }]}>
          {t('location.notSetSearch')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles(colors).container, { backgroundColor: colors.background }]}>
      <View style={[styles(colors).searchWrapper, { paddingTop: insets.top + 16 }]}>
        <TextInput
          style={[
            styles(colors).input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={keyword}
          onChangeText={setKeyword}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          style={[styles(colors).button, { backgroundColor: colors.buttonSecondary }]}
          onPress={handleSearchSubmit}
          disabled={isLoading}
        >
          <Text style={[styles(colors).buttonText, { color: colors.buttonSecondaryText }]}>
            {t('search.button')}
          </Text>
        </TouchableOpacity>
      </View>

      <ProductList
        products={products}
        isLoading={isLoading}
        keyword={keyword}
        count={count}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    notice: {
      fontSize: 16,
      textAlign: 'center',
    },
    searchWrapper: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    input: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
    },
    button: {
      paddingHorizontal: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft: 12,
    },
    buttonText: {
      fontWeight: '600',
    },
  });
