import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationContext } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { calculateDistanceKm } from '../utils/location';
import { Supermarket } from '../types';

export const SupermarketsDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  const context = useLocationContext();
  const location = context?.location;
  const radiusKm = context?.radiusKm || 5;
  const supermarkets = context?.supermarkets || [];

  const supermarketsWithDistance = useMemo(() => {
    if (!location) {
      return [] as Supermarket[];
    }

    const mapped = (supermarkets || [])
      .map((market) => {
        if (!market || typeof market.latitude !== 'number' || typeof market.longitude !== 'number') {
          return null;
        }
        
        const distance = calculateDistanceKm(
          location.latitude,
          location.longitude,
          market.latitude,
          market.longitude,
        );
        
        return {
          ...market,
          distanceKm: distance,
        };
      });
    
    const filtered = mapped.filter((market) => market !== null) as Supermarket[];
    return filtered.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }, [location, supermarkets]);

  return (
    <View style={[styles(colors).container, { backgroundColor: colors.drawerBackground }]}>
      <View style={[styles(colors).header, { paddingTop: insets.top + 20, backgroundColor: colors.drawerHeaderBackground, borderBottomColor: colors.border }]}>
        <Text style={[styles(colors).title, { color: colors.text }]}>
          {t('supermarkets.title')}
        </Text>
        <Text style={[styles(colors).subtitle, { color: colors.textSecondary }]}>
          {t('supermarkets.found', { count: supermarketsWithDistance.length, radius: radiusKm })}
        </Text>
      </View>
      {supermarketsWithDistance.length > 0 ? (
        <DrawerContentScrollView
          {...props}
          style={styles(colors).scrollView}
          contentContainerStyle={styles(colors).scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {supermarketsWithDistance.map((item, index) => {
            const distanceText = item.distanceKm !== undefined && !isNaN(item.distanceKm)
              ? `${item.distanceKm.toFixed(2)} km`
              : t('supermarkets.distanceNA');

            return (
              <View key={`${item.name}-${index}`} style={[styles(colors).listItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles(colors).marketName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles(colors).marketBrand, { color: colors.textSecondary }]}>
                  {t('supermarkets.brand', { brand: item.brand })}
                </Text>
                <Text style={[styles(colors).marketDistance, { color: colors.textSecondary }]}>
                  {t('supermarkets.distance', { distance: item.distanceKm?.toFixed(2) || 'N/A' })}
                </Text>
              </View>
            );
          })}
        </DrawerContentScrollView>
      ) : (
        <View style={styles(colors).emptyState}>
          <Text style={[styles(colors).emptyText, { color: colors.warning }]}>
            {t('supermarkets.none', { radius: radiusKm })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
      flexGrow: 0,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
    },
    listItem: {
      padding: 16,
      borderBottomWidth: 1,
    },
    marketName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    marketBrand: {
      fontSize: 14,
      marginBottom: 4,
    },
    marketDistance: {
      fontSize: 14,
    },
    emptyState: {
      padding: 24,
      alignItems: 'center',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
    },
  });
