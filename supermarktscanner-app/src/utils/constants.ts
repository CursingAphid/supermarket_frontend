export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export const DEFAULT_RADIUS_KM = 5;

export const MAX_RADIUS_KM = 20;

export const DEFAULT_SEARCH_KEYWORD = 'Knorr';

export const BRAND_COLORS: Record<string, string> = {
  'Albert Heijn': '#5B9BD5',
  Dirk: '#0000ff',
  Vomar: '#00ff00',
  Jumbo: '#ffff00',
  Plus: '#90EE90',
  Aldi: '#8800ff',
  Hoogvliet: '#ff00ff',
  Dekamarkt: '#00ffff',
};

export const FALLBACK_BRAND_COLOR = '#ff5722';

export const STORAGE_KEYS = {
  LOCATION: '@supermarktscanner/location',
  RADIUS: '@supermarktscanner/radius',
  SUPERMARKETS: '@supermarktscanner/supermarkets',
  THEME: '@supermarktscanner/theme',
  LANGUAGE: '@supermarktscanner/language',
};

