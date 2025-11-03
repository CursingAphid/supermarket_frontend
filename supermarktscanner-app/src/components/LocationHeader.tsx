import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocationContext } from '../context/LocationContext';

type Props = {
  onChangeLocation: () => void;
};

export const LocationHeader: React.FC<Props> = ({ onChangeLocation }) => {
  const { location, radiusKm } = useLocationContext();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Supermarktscanner Product Search</Text>
        <Text style={styles.subtitle}>
          Location: {location?.address ?? 'Not set'} | Max distance: {radiusKm} km
        </Text>
        <TouchableOpacity style={styles.button} onPress={onChangeLocation}>
          <Text style={styles.buttonText}>Change Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#0d6efd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

