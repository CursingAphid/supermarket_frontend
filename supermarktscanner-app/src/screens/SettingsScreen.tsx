import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
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

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { location, radiusKm, setLocationData, setError, isLoading, setLoading } =
    useLocationContext();
  const [address, setAddress] = useState<string>(location?.address || '');
  const [radius, setRadius] = useState<string>(String(radiusKm));

  useEffect(() => {
    if (location?.address) {
      setAddress(location.address);
    }
    setRadius(String(radiusKm));
  }, [location?.address, radiusKm]);

  const handleRadiusChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(sanitized);
    if (sanitized === '' || (!isNaN(numValue) && numValue <= MAX_RADIUS_KM)) {
      setRadius(sanitized);
    }
  };

  const handleUpdateLocation = async () => {
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
      const newSupermarkets = await findSupermarkets(
        geocodeResult.latitude,
        geocodeResult.longitude,
        numericRadius,
      );

      await setLocationData({
        location: geocodeResult,
        radiusKm: numericRadius,
        supermarkets: newSupermarkets,
      });

      Alert.alert(t('general.success'), t('location.updateSuccess'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('location.updateError');
      setError(message);
      Alert.alert(t('general.errorTitle'), message);
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <View style={[styles(colors).centered, { backgroundColor: colors.background }]}>
        <Text style={[styles(colors).notice, { color: colors.textSecondary }]}>
          {t('location.notSetMessage')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles(colors).container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles(colors).content, { paddingTop: insets.top + 24 }]}
    >
      <Text style={[styles(colors).header, { color: colors.text }]}>
        {t('settings.title')}
      </Text>
      <Text style={[styles(colors).subtitle, { color: colors.textSecondary }]}>
        {t('settings.subtitle')}
      </Text>

      {/* Theme Section */}
      <View style={[styles(colors).section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles(colors).sectionTitle, { color: colors.text }]}>
          {t('theme.title')}
        </Text>
        <View style={styles(colors).switchRow}>
          <Text style={[styles(colors).switchLabel, { color: colors.text }]}>
            {theme === 'dark' ? t('theme.dark') : t('theme.light')}
          </Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>

      {/* Language Section */}
      <View style={[styles(colors).section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles(colors).sectionTitle, { color: colors.text }]}>
          {t('language.title')}
        </Text>
        <View style={styles(colors).languageRow}>
          <TouchableOpacity
            style={[
              styles(colors).languageButton,
              language === 'nl' && { backgroundColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => setLanguage('nl')}
          >
            <Text
              style={[
                styles(colors).languageButtonText,
                { color: language === 'nl' ? colors.buttonPrimaryText : colors.text },
              ]}
            >
              {t('language.dutch')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(colors).languageButton,
              language === 'en' && { backgroundColor: colors.primary },
              { borderColor: colors.border },
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text
              style={[
                styles(colors).languageButtonText,
                { color: language === 'en' ? colors.buttonPrimaryText : colors.text },
              ]}
            >
              {t('language.english')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Section */}
      <View style={[styles(colors).section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles(colors).sectionTitle, { color: colors.text }]}>
          {t('location.address')}
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
          onPress={handleUpdateLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.buttonPrimaryText} />
          ) : (
            <Text style={[styles(colors).buttonText, { color: colors.buttonPrimaryText }]}>
              {t('location.updateButton')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles(colors).infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles(colors).infoTitle, { color: colors.text }]}>
          {t('location.currentLocation')}
        </Text>
        <Text style={[styles(colors).infoText, { color: colors.textSecondary }]}>
          {location.address}
        </Text>
        <Text style={[styles(colors).infoText, { color: colors.textSecondary }]}>
          {t('location.maxDistance', { km: radiusKm })}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 24,
      paddingBottom: 24,
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
    header: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 32,
    },
    section: {
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    switchLabel: {
      fontSize: 16,
    },
    languageRow: {
      flexDirection: 'row',
      gap: 12,
    },
    languageButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
    },
    languageButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 16,
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
      marginTop: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
    },
    infoBox: {
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 8,
    },
  });
