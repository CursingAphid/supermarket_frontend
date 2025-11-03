import axios, { AxiosError } from 'axios';
import {
  API_BASE_URL,
  DEFAULT_RADIUS_KM,
} from '../utils/constants';
import {
  GeocodeResponse,
  Product,
  ProductSearchResponse,
  Supermarket,
  SupermarketResponse,
} from '../types';

// Debug: Log the API URL being used
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📱 Environment variable:', process.env.EXPO_PUBLIC_API_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const message =
      axiosError.response?.data?.detail || axiosError.message || 'Unknown API error';
    throw new Error(message);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error('Unexpected error occurred');
};

export const geocodeAddress = async (address: string): Promise<GeocodeResponse> => {
  try {
    const { data } = await apiClient.post<GeocodeResponse>('/geocode', { address });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const findSupermarkets = async (
  latitude: number,
  longitude: number,
  radiusKm: number = DEFAULT_RADIUS_KM,
): Promise<Supermarket[]> => {
  try {
    const { data } = await apiClient.post<SupermarketResponse>('/supermarkets', {
      latitude,
      longitude,
      radius_km: radiusKm,
    });
    return data.supermarkets || [];
  } catch (error) {
    return handleError(error);
  }
};

export const searchProducts = async (
  keyword: string,
  latitude?: number,
  longitude?: number,
  radiusKm?: number,
): Promise<ProductSearchResponse> => {
  try {
    const params: Record<string, string | number> = {
      keyword,
    };

    if (latitude !== undefined && longitude !== undefined) {
      params.latitude = latitude;
      params.longitude = longitude;
    }

    if (radiusKm !== undefined) {
      params.radius_km = radiusKm;
    }

    const { data } = await apiClient.get<ProductSearchResponse>('/search', { params });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const { data } = await apiClient.get<{ status: string }>('/health');
    return data.status === 'healthy';
  } catch (error) {
    return handleError(error);
  }
};

