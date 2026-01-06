import { useState, useEffect } from 'react';
import { Search, Loader2, MapPinned, ChevronUp, ChevronDown, X } from 'lucide-react';
import { IPDetails } from './types';
import { MapView } from './components/MapView';
import { IPDetailsCard } from './components/IPDetailsCard';
import { calculateDistance, calculateBearing } from './utils';

function App() {
  const [userIP, setUserIP] = useState<IPDetails | null>(null);
  const [searchedIPs, setSearchedIPs] = useState<IPDetails[]>([]);
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch('https://briefbuletin-api.onrender.com/api/my-location');
      const data = await response.json();
      if (data.success) {
        setUserIP(data);
      }
    } catch (err) {
      console.error('Failed to fetch user location:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleIPLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://briefbuletin-api.onrender.com/api/ip-lookup?ip=${ipInput.trim()}`
      );
      const data = await response.json();

      if (data.success) {
        // Check if IP already exists
        const exists = searchedIPs.some(ip => ip.ip === data.ip);
        if (!exists) {
          setSearchedIPs(prev => [...prev, data]);
        } else {
          setError('This IP address has already been searched.');
        }
        setIpInput('');
      } else {
        setError('Invalid IP address or lookup failed');
      }
    } catch (err) {
      setError('Failed to fetch IP details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeIP = (index: number) => {
    setSearchedIPs(prev => prev.filter((_, i) => i !== index));
  };

  const moveIP = (index: number, direction: 'up' | 'down') => {
    setSearchedIPs(prev => {
      const newIPs = [...prev];
      if (direction === 'up' && index > 0) {
        [newIPs[index], newIPs[index - 1]] = [newIPs[index - 1], newIPs[index]];
      } else if (direction === 'down' && index < newIPs.length - 1) {
        [newIPs[index], newIPs[index + 1]] = [newIPs[index + 1], newIPs[index]];
      }
      return newIPs;
    });
  };

  const getMarkerColor = (index: number) => {
    const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#c026d3', '#db2777'];
    return colors[index % colors.length];
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPinned className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            IP Location Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Discover the geographic location of any IP address
          </p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleIPLookup} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="Enter IP address (e.g., 49.37.43.161)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Lookup
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </form>
        </div>

        <div className="mb-8">
          <MapView
            userLocation={
              userIP
                ? { lat: userIP.latitude, lng: userIP.longitude }
                : null
            }
            searchedLocations={searchedIPs}
            userCity={userIP?.city}
          />
        </div>

        {searchedIPs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Searched IP Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchedIPs.map((ip, index) => {
                const distance = userIP ? calculateDistance(
                  userIP.latitude,
                  userIP.longitude,
                  ip.latitude,
                  ip.longitude
                ) : undefined;
                const direction = userIP ? calculateBearing(
                  userIP.latitude,
                  userIP.longitude,
                  ip.latitude,
                  ip.longitude
                ) : undefined;
                const prevIP = index > 0 ? searchedIPs[index - 1] : null;
                const sequentialDistance = prevIP ? calculateDistance(
                  prevIP.latitude,
                  prevIP.longitude,
                  ip.latitude,
                  ip.longitude
                ) : undefined;

                return (
                  <div key={ip.ip} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getMarkerColor(index) }}></div>
                        IP: {ip.ip}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveIP(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveIP(index, 'down')}
                          disabled={index === searchedIPs.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeIP(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove IP"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <IPDetailsCard details={ip} distance={distance} direction={direction} />
                      {sequentialDistance && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <p>Distance from previous: <span className="font-semibold">{sequentialDistance.toFixed(2)} km</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userIP && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                Your Location
              </h3>
              <IPDetailsCard details={userIP} />
            </div>
          )}

          {searchedIPs.length === 0 && (
            <div className="text-center mt-8 p-8 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">
                Enter an IP address above to start tracking locations. All searched IPs will be marked on the map with different colors.
              </p>
            </div>
          )}
        </div>

        {/* Copyright Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © 2025{' '}
              <a
                href="https://github.com/Shawan-Das"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Shawan Das
              </a>
              . All rights reserved.
            </p>
            <p className="mt-1">
              Built with ❤️ using React, TypeScript, and Leaflet
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
