import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Location, LocationContextState, Supermarket } from '../types';
import { DEFAULT_RADIUS_KM, STORAGE_KEYS } from '../utils/constants';

const LocationContext = createContext<LocationContextState | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};

export const LocationProvider: React.FC<ProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [isLocationSet, setIsLocationSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [storedLocation, storedRadius, storedSupermarkets] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LOCATION),
          AsyncStorage.getItem(STORAGE_KEYS.RADIUS),
          AsyncStorage.getItem(STORAGE_KEYS.SUPERMARKETS),
        ]);

        if (storedLocation) {
          setLocation(JSON.parse(storedLocation));
          setIsLocationSet(true);
        }

        if (storedRadius) {
          setRadiusKm(Number(storedRadius));
        }

        if (storedSupermarkets) {
          setSupermarkets(JSON.parse(storedSupermarkets));
        }
      } catch (storageError) {
        console.warn('Failed to load persisted location state', storageError);
      }
    };

    loadPersistedState().catch((loadError) => {
      console.warn('Unexpected error loading persisted state', loadError);
    });
  }, []);

  const persistState = useCallback(
    async (nextLocation: Location, nextRadius: number, nextSupermarkets: Supermarket[]) => {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(nextLocation)),
        AsyncStorage.setItem(STORAGE_KEYS.RADIUS, String(nextRadius)),
        AsyncStorage.setItem(STORAGE_KEYS.SUPERMARKETS, JSON.stringify(nextSupermarkets)),
      ]);
    },
    [],
  );

  const setLocationData = useCallback<LocationContextState['setLocationData']>(
    async ({ location: nextLocation, radiusKm: nextRadius, supermarkets: nextSupermarkets }) => {
      setLocation(nextLocation);
      setRadiusKm(nextRadius);
      setSupermarkets(nextSupermarkets);
      setIsLocationSet(true);
      setError(null);

      try {
        await persistState(nextLocation, nextRadius, nextSupermarkets);
      } catch (storageError) {
        console.warn('Failed to persist location state', storageError);
      }
    },
    [persistState],
  );

  const resetLocation = useCallback<LocationContextState['resetLocation']>(async () => {
    setLocation(null);
    setRadiusKm(DEFAULT_RADIUS_KM);
    setSupermarkets([]);
    setIsLocationSet(false);

    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.LOCATION),
        AsyncStorage.removeItem(STORAGE_KEYS.RADIUS),
        AsyncStorage.removeItem(STORAGE_KEYS.SUPERMARKETS),
      ]);
    } catch (storageError) {
      console.warn('Failed to reset persisted location state', storageError);
    }
  }, []);

  const contextValue = useMemo<LocationContextState>(
    () => ({
      location,
      radiusKm,
      supermarkets,
      isLocationSet,
      isLoading,
      error,
      setLocationData,
      resetLocation,
      setError,
      setLoading: setIsLoading,
    }),
    [
      location,
      radiusKm,
      supermarkets,
      isLocationSet,
      isLoading,
      error,
      setLocationData,
      resetLocation,
    ],
  );

  return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>;
};

export const useLocationContext = (): LocationContextState => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }

  return context;
};

