import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPDetails } from '../types';
import { calculateDistance } from '../utils';
import { Moon, Sun, Globe, LocateFixed, Loader2 } from 'lucide-react';

interface MapViewProps {
  userLocation: IPDetails | null;
  searchedLocations: IPDetails[];
}

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentLocationIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getTargetIcon = (color: string) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const markerColors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet', 'purple', 'pink'];

// Tile layer configurations
const tileLayerConfigs = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

// Component to animate map view
function AnimatedMapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    // Use flyTo for smooth animation instead of setView
    map.flyTo(center, zoom, {
      duration: 1.5, // 1.5 seconds animation
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  
  return null;
}

// Component to store map reference
function MapControllerWithRef({ onMapReady }: { onMapReady: (map: any) => void }) {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
}

// Enhanced Popup Component
function EnhancedPopup({ location, isUserLocation, isCurrentLocation, distance, index }: {
  location: IPDetails | { latitude: number; longitude: number } | null;
  isUserLocation?: boolean;
  isCurrentLocation?: boolean;
  distance?: number;
  index?: number;
}) {
  if (isCurrentLocation) {
    const loc = location as { latitude: number; longitude: number };
    return (
      <Popup className="custom-popup">
        <div className="p-3 min-w-[240px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-bold text-sm text-gray-900">Your Current Location</span>
          </div>
          <div className="bg-green-50 rounded px-2 py-1.5 mb-2 border border-green-200">
            <p className="text-xs text-gray-700"><span className="font-semibold">Latitude:</span> {loc.latitude.toFixed(4)}</p>
            <p className="text-xs text-gray-700"><span className="font-semibold">Longitude:</span> {loc.longitude.toFixed(4)}</p>
          </div>
        </div>
      </Popup>
    );
  }

  if (isUserLocation) {
    const loc = location as IPDetails;
    return (
      <Popup className="custom-popup">
        <div className="p-3 min-w-[220px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-bold text-sm text-gray-900">Your Location</span>
          </div>
          {loc && (
            <>
              <div className="bg-blue-50 rounded px-2 py-1 mb-2">
                <p className="text-xs font-semibold text-blue-700">{loc.city}</p>
                <p className="text-xs text-blue-600">{loc.country}</p>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">IP:</span> {loc.ip}</p>
              </div>
            </>
          )}
        </div>
      </Popup>
    );
  }

  const loc = location as IPDetails;
  return (
    <Popup className="custom-popup">
      <div className="p-3 min-w-[240px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getColorForIndex(index || 0) }}></div>
            <span className="font-bold text-sm text-gray-900">Target #{(index || 0) + 1}</span>
          </div>
        </div>
        {loc && (
          <>
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded px-2 py-1.5 mb-2 border border-slate-200">
              <p className="text-sm font-semibold text-gray-900">{loc.city}</p>
              <p className="text-xs text-gray-600">{loc.country}</p>
            </div>
            <div className="text-xs text-gray-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold">IP:</span>
                <span className="text-blue-600 font-mono text-xs">{loc.ip}</span>
              </div>
              {distance !== undefined && (
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="font-semibold">Distance:</span>
                  <span className="font-mono">{distance.toFixed(2)} km</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Popup>
  );
}

function getColorForIndex(index: number): string {
  const colorMap: { [key: string]: string } = {
    'red': '#ef4444',
    'orange': '#f97316',
    'yellow': '#eab308',
    'green': '#22c55e',
    'cyan': '#06b6d4',
    'blue': '#3b82f6',
    'violet': '#8b5cf6',
    'purple': '#a855f7',
    'pink': '#ec4899'
  };
  return colorMap[markerColors[index % markerColors.length]] || '#3b82f6';
}

export function MapView({ userLocation, searchedLocations }: MapViewProps) {
  const [mapTheme, setMapTheme] = useState<'light' | 'dark' | 'satellite'>('light');
  const [geoLocation, setGeoLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const center = searchedLocations.length > 0
    ? [searchedLocations[0].latitude, searchedLocations[0].longitude] as LatLngExpression
    : userLocation
      ? [userLocation.latitude, userLocation.longitude] as LatLngExpression
      : [23.8103, 90.4125] as LatLngExpression;

  const zoom = searchedLocations.length > 1 ? 3 : searchedLocations.length === 1 ? 6 : 10;

  const handleCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLocation({ latitude, longitude });
        setIsLocating(false);

        // Focus map on current location
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 12, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable it in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('The request to get user location timed out.');
            break;
          default:
            setLocationError('An error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Map Controls */}
      <div className="flex gap-2 px-1 flex-wrap">
        <button
          onClick={() => setMapTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
            mapTheme === 'light'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <Sun size={16} />
          Light
        </button>
        <button
          onClick={() => setMapTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
            mapTheme === 'dark'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <Moon size={16} />
          Dark
        </button>
        <button
          onClick={() => setMapTheme('satellite')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
            mapTheme === 'satellite'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <Globe size={16} />
          Satellite
        </button>

        {/* Geolocation Button */}
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          title="Locate me - Uses your browser's geolocation"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
            isLocating
              ? 'bg-green-400 text-white shadow-md'
              : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
          } disabled:opacity-75 disabled:cursor-not-allowed`}
        >
          {isLocating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <LocateFixed size={16} />
              My Location
            </>
          )}
        </button>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="px-1">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{locationError}</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
        >
          <TileLayer
            attribution={tileLayerConfigs[mapTheme].attribution}
            url={tileLayerConfigs[mapTheme].url}
          />

          <AnimatedMapController center={center} zoom={zoom} />

          <MapControllerWithRef onMapReady={(map) => { mapRef.current = map; }} />

          {/* Current Geolocation Marker */}
          {geoLocation && (
            <Marker position={[geoLocation.latitude, geoLocation.longitude]} icon={currentLocationIcon}>
              <EnhancedPopup location={geoLocation} isCurrentLocation={true} />
            </Marker>
          )}

          {/* IP-based User Location Marker */}
          {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
              <EnhancedPopup location={userLocation} isUserLocation={true} />
            </Marker>
          )}

          {/* Searched IP Markers */}
          {searchedLocations.map((location, index) => (
            <Marker
              key={location.ip}
              position={[location.latitude, location.longitude]}
              icon={getTargetIcon(markerColors[index % markerColors.length])}
            >
              <EnhancedPopup
                location={location}
                index={index}
                distance={
                  userLocation
                    ? calculateDistance(userLocation.latitude, userLocation.longitude, location.latitude, location.longitude)
                    : undefined
                }
              />
            </Marker>
          ))}

          {/* Lines connecting locations */}
          {userLocation && searchedLocations.length > 0 && (
            <>
              {/* Line from user to first searched location */}
              <Polyline
                positions={[
                  [userLocation.latitude, userLocation.longitude],
                  [searchedLocations[0].latitude, searchedLocations[0].longitude]
                ]}
                color="#3b82f6"
                weight={3}
                opacity={0.8}
              />
              {/* Lines between consecutive searched locations */}
              {searchedLocations.slice(1).map((location, index) => (
                <Polyline
                  key={`line-${index}`}
                  positions={[
                    [searchedLocations[index].latitude, searchedLocations[index].longitude],
                    [location.latitude, location.longitude]
                  ]}
                  color="#ef4444"
                  weight={2}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              ))}
            </>
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      {(userLocation || geoLocation || searchedLocations.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Legend</p>
          <div className="space-y-1.5">
            {geoLocation && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700 dark:text-gray-300">Your Current Location (Geolocation)</span>
              </div>
            )}
            {userLocation && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700 dark:text-gray-300">Your IP Location</span>
              </div>
            )}
            {searchedLocations.map((_, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForIndex(index) }}></div>
                <span className="text-gray-700 dark:text-gray-300">Target #{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
