import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPDetails } from '../types';
import { calculateDistance } from '../utils';

interface MapViewProps {
  userLocation: { lat: number; lng: number } | null;
  searchedLocations: IPDetails[];
  userCity?: string;
}

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
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

export function MapView({ userLocation, searchedLocations, userCity }: MapViewProps) {
  const center = searchedLocations.length > 0
    ? { lat: searchedLocations[0].latitude, lng: searchedLocations[0].longitude }
    : userLocation || { lat: 23.8103, lng: 90.4125 };

  const zoom = searchedLocations.length > 1 ? 3 : searchedLocations.length === 1 ? 6 : 10;

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
                {userCity && <p>{userCity}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        {searchedLocations.map((location, index) => (
          <Marker
            key={location.ip}
            position={[location.latitude, location.longitude]}
            icon={getTargetIcon(markerColors[index % markerColors.length])}
          >
            <Popup>
              <div className="text-sm">
                <strong>IP: {location.ip}</strong>
                <p>{location.city}, {location.country}</p>
                {userLocation && (
                  <p>Distance: {calculateDistance(userLocation.lat, userLocation.lng, location.latitude, location.longitude).toFixed(2)} km</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && searchedLocations.length > 0 && (
          <>
            {/* Line from user to first searched location */}
            <Polyline
              positions={[
                [userLocation.lat, userLocation.lng],
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
  );
}
