import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BRAND_COLORS, FALLBACK_BRAND_COLOR } from '../utils/constants';
import { Supermarket } from '../types';

type Props = {
  latitude: number;
  longitude: number;
  radiusKm: number;
  supermarkets: Supermarket[];
};

export const SupermarketMapView: React.FC<Props> = ({
  latitude,
  longitude,
  radiusKm,
  supermarkets,
}) => {
  const mapHtml = useMemo(() => {
    const radiusInMeters = radiusKm * 1000;
    
    // Create markers for supermarkets (simple circular pins with dynamic sizing)
    const supermarketMarkers = supermarkets
      .map((market, index) => {
        const color = BRAND_COLORS[market.brand] ?? FALLBACK_BRAND_COLOR;
        return `
          const marker${index} = L.marker([${market.latitude}, ${market.longitude}], {
            id: 'market-${index}',
            color: '${color}'
          })
            .addTo(map)
            .bindPopup('<b>${market.name}</b><br/>${market.brand}');
        `;
      })
      .join('\n');
    
    const updateMarkerSizes = `
      const updateMarkerSizes = () => {
        const zoom = map.getZoom();
        // Calculate size based on zoom (smaller when zoomed out, larger when zoomed in)
        // Zoom 8-10: 8px, 11-12: 12px, 13-14: 16px, 15+: 20px
        let size = 8;
        let borderWidth = 2;
        
        if (zoom >= 15) {
          size = 20;
          borderWidth = 3;
        } else if (zoom >= 13) {
          size = 16;
          borderWidth = 2.5;
        } else if (zoom >= 11) {
          size = 12;
          borderWidth = 2;
        } else {
          size = 8;
          borderWidth = 1.5;
        }
        
        // Update supermarket markers
        ${supermarkets.map((market, index) => {
          const color = BRAND_COLORS[market.brand] ?? FALLBACK_BRAND_COLOR;
          return `
            marker${index}.setIcon(L.divIcon({
              className: 'pin-marker-${index}',
              html: '<div style="width: ' + size + 'px; height: ' + size + 'px; background-color: ${color}; border-radius: 50%; border: ' + borderWidth + 'px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>',
              iconSize: [size, size],
              iconAnchor: [size / 2, size / 2],
              popupAnchor: [0, -size / 2]
            }));
          `;
        }).join('\n')}
        
        // Update user location marker (smaller)
        const userSize = Math.max(8, size - 4);
        const userBorderWidth = Math.max(1.5, borderWidth - 0.5);
        userMarker.setIcon(L.divIcon({
          className: 'user-marker',
          html: '<div style="width: ' + userSize + 'px; height: ' + userSize + 'px; background-color: #dc3545; border-radius: 50%; border: ' + userBorderWidth + 'px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [userSize, userSize],
          iconAnchor: [userSize / 2, userSize / 2]
        }));
      };
      
      // Update sizes on zoom
      map.on('zoomend', updateMarkerSizes);
      // Initial size update
      updateMarkerSizes();
    `;

    // Create circle for radius (subtle)
    const radiusCircle = `
      L.circle([${latitude}, ${longitude}], {
        color: 'rgba(0, 0, 0, 0.2)',
        fillColor: 'rgba(0, 0, 0, 0.05)',
        fillOpacity: 0.1,
        weight: 1,
        radius: ${radiusInMeters}
      }).addTo(map);
    `;

    // User location marker (simple red dot - size will be updated dynamically)
    const userMarker = `
      const userMarker = L.marker([${latitude}, ${longitude}])
        .addTo(map)
        .bindPopup('<b>Your Location</b>');
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            .leaflet-container { 
              background: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .leaflet-div-icon { 
              background: transparent !important; 
              border: none !important; 
              margin: 0 !important;
              padding: 0 !important;
            }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            }
            .leaflet-popup-content {
              margin: 12px 16px;
              font-size: 14px;
            }
            .leaflet-attribution {
              display: none;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            const map = L.map('map', { zoomControl: false });
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '',
              maxZoom: 19,
              subdomains: 'abcd'
            }).addTo(map);
            
            ${userMarker}
            ${radiusCircle}
            ${supermarketMarkers}
            ${updateMarkerSizes}
            
            // Calculate bounds to show the full radius circle
            const radiusMeters = ${radiusKm * 1000};
            const metersPerDegreeLat = 111000;
            const metersPerDegreeLon = 111000 * Math.cos(${latitude} * Math.PI / 180);
            
            const latOffset = radiusMeters / metersPerDegreeLat;
            const lonOffset = radiusMeters / metersPerDegreeLon;
            
            // Create bounds that encompass the radius circle
            const radiusBounds = L.latLngBounds(
              [${latitude} - latOffset, ${longitude} - lonOffset],
              [${latitude} + latOffset, ${longitude} + lonOffset]
            );
            
            // Fit map to show the radius circle with some padding
            map.fitBounds(radiusBounds.pad(0.1));
          </script>
        </body>
      </html>
    `;
  }, [latitude, longitude, radiusKm, supermarkets]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

