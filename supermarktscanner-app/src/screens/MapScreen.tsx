import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationContext } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { SupermarketMapView } from '../components/MapView';
import { calculateDistanceKm } from '../utils/location';
import { Supermarket } from '../types';

export const MapScreen: React.FC = () => {
  const navigation = useNavigation();
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

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (!location) {
    return (
      <View style={[styles(colors).centered, { backgroundColor: colors.background }]}>
        <Text style={[styles(colors).notice, { color: colors.textSecondary }]}>
          {t('location.notSetMap')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles(colors).container, { backgroundColor: colors.mapBackground }]}>
      <View style={[styles(colors).hamburgerButton, { top: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={openDrawer}
          style={[styles(colors).hamburger, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
        >
          <View style={[styles(colors).hamburgerLine, { backgroundColor: colors.text }]} />
          <View style={[styles(colors).hamburgerLine, { backgroundColor: colors.text }]} />
          <View style={[styles(colors).hamburgerLine, { backgroundColor: colors.text }]} />
        </TouchableOpacity>
      </View>
      <SupermarketMapView
        latitude={location.latitude}
        longitude={location.longitude}
        radiusKm={radiusKm}
        supermarkets={supermarketsWithDistance}
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
    hamburgerButton: {
      position: 'absolute',
      left: 16,
      zIndex: 1000,
    },
    hamburger: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    hamburgerLine: {
      width: 20,
      height: 2,
      marginVertical: 3,
      borderRadius: 1,
    },
  });
