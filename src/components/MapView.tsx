import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  userLocation: { lat: number; lng: number } | null;
  targetLocation: { lat: number; lng: number } | null;
  userCity?: string;
  targetCity?: string;
}

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const targetIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function MapView({ userLocation, targetLocation, userCity, targetCity }: MapViewProps) {
  const center = targetLocation || userLocation || { lat: 23.8103, lng: 90.4125 };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={targetLocation && userLocation ? 4 : 10}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

        {targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]} icon={targetIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Target Location</strong>
                {targetCity && <p>{targetCity}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        {userLocation && targetLocation && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [targetLocation.lat, targetLocation.lng]
            ]}
            color="#3b82f6"
            weight={2}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}
