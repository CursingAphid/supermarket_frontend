import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

type Props = {
  products: Product[];
  isLoading: boolean;
  keyword: string;
  count?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export const ProductList: React.FC<Props> = ({
  products,
  isLoading,
  keyword,
  count,
  onRefresh,
  refreshing = false,
}) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <View style={[styles(colors).centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles(colors).loadingText, { color: colors.textSecondary }]}>
          {t('search.searching')}
        </Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={[styles(colors).centered, { backgroundColor: colors.background }]}>
        <Text style={[styles(colors).emptyState, { color: colors.textSecondary }]}>
          {t('search.noResults', { keyword })}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => `${item.title}-${index}`}
      contentContainerStyle={styles(colors).listContent}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListHeaderComponent={
        count !== undefined ? (
          <Text style={[styles(colors).resultCount, { color: colors.text }]}>
            {t('search.found', { count, keyword })}
          </Text>
        ) : null
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
      style={{ backgroundColor: colors.background }}
    />
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    loadingText: {
      marginTop: 12,
    },
    emptyState: {
      fontSize: 16,
      textAlign: 'center',
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    resultCount: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
    },
  });
