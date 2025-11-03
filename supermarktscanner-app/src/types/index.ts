export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Supermarket {
  name: string;
  brand: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

export interface Product {
  title: string;
  price: string;
  size: string;
  image: string | null;
  supermarket: string;
  on_discount: boolean;
  original_price?: string;
  discount_action?: string;
  discount_date?: string;
  discount_timestamp?: number;
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SupermarketResponse {
  supermarkets: Supermarket[];
  count: number;
}

export interface ProductSearchResponse {
  keyword: string;
  products: Product[];
  count: number;
}

export interface LocationContextState {
  location: Location | null;
  radiusKm: number;
  supermarkets: Supermarket[];
  isLocationSet: boolean;
  isLoading: boolean;
  error: string | null;
  setLocationData: (params: {
    location: Location;
    radiusKm: number;
    supermarkets: Supermarket[];
  }) => Promise<void>;
  resetLocation: () => Promise<void>;
  setError: (message: string | null) => void;
  setLoading: (value: boolean) => void;
}

