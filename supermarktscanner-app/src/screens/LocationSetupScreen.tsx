import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { geocodeAddress, findSupermarkets } from '../services/api';
import { useLocationContext } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { DEFAULT_RADIUS_KM, MAX_RADIUS_KM } from '../utils/constants';

type Props = {
  onLocationSet: () => void;
};

export const LocationSetupScreen: React.FC<Props> = ({ onLocationSet }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { setLocationData, setError, isLoading, setLoading, error } = useLocationContext();
  const [address, setAddress] = useState<string>('');
  const [radius, setRadius] = useState<string>(String(DEFAULT_RADIUS_KM));

  const handleRadiusChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(sanitized);
    if (sanitized === '' || (!isNaN(numValue) && numValue <= MAX_RADIUS_KM)) {
      setRadius(sanitized);
    }
  };

  const handleSetLocation = async () => {
    const numericRadius = Number(radius) || DEFAULT_RADIUS_KM;

    if (!address.trim()) {
      Alert.alert(t('location.addressRequired'), t('location.addressRequiredMessage'));
      return;
    }

    if (numericRadius > MAX_RADIUS_KM) {
      Alert.alert(
        t('location.radiusInvalid'),
        t('location.radiusInvalidMessage', { max: MAX_RADIUS_KM }),
      );
      setRadius(String(MAX_RADIUS_KM));
      return;
    }

    if (numericRadius <= 0) {
      Alert.alert(t('location.radiusInvalid'), t('location.radiusTooSmall'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const geocodeResult = await geocodeAddress(address.trim());
      const supermarkets = await findSupermarkets(
        geocodeResult.latitude,
        geocodeResult.longitude,
        numericRadius,
      );

      await setLocationData({
        location: geocodeResult,
        radiusKm: numericRadius,
        supermarkets,
      });

      onLocationSet();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('location.error');
      setError(message);
      Alert.alert(t('general.errorTitle'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles(colors).container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles(colors).content, { paddingTop: insets.top + 24 }]}
    >
      <Text style={[styles(colors).title, { color: colors.text }]}>
        {t('location.setTitle')}
      </Text>
      <Text style={[styles(colors).subtitle, { color: colors.textSecondary }]}>
        {t('location.setSubtitle')}
      </Text>

      {error ? (
        <Text style={[styles(colors).errorText, { color: colors.error }]}>{error}</Text>
      ) : null}

      <Text style={[styles(colors).label, { color: colors.text }]}>{t('location.address')}</Text>
      <TextInput
        style={[
          styles(colors).input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        placeholder={t('location.addressPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        value={address}
        onChangeText={setAddress}
        autoCapitalize="none"
      />

      <Text style={[styles(colors).label, { color: colors.text }]}>
        {t('location.distanceMax', { max: MAX_RADIUS_KM })}
      </Text>
      <TextInput
        style={[
          styles(colors).input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        placeholder={t('location.distancePlaceholder', { max: MAX_RADIUS_KM })}
        placeholderTextColor={colors.textSecondary}
        keyboardType="decimal-pad"
        value={radius}
        onChangeText={handleRadiusChange}
        maxLength={4}
      />

      <TouchableOpacity
        style={[styles(colors).button, { backgroundColor: colors.buttonPrimary }]}
        onPress={handleSetLocation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.buttonPrimaryText} />
        ) : (
          <Text style={[styles(colors).buttonText, { color: colors.buttonPrimaryText }]}>
            {t('location.setButton')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: 'center',
    },
    errorText: {
      marginBottom: 16,
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      borderRadius: 8,
      borderWidth: 1,
      padding: 14,
      marginBottom: 20,
      fontSize: 16,
    },
    button: {
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
