import { useState, useEffect } from 'react';
import { Search, Loader2, MapPinned } from 'lucide-react';
import { IPDetails } from './types';
import { MapView } from './components/MapView';
import { IPDetailsCard } from './components/IPDetailsCard';
import { calculateDistance, calculateBearing } from './utils';

function App() {
  const [userIP, setUserIP] = useState<IPDetails | null>(null);
  const [targetIP, setTargetIP] = useState<IPDetails | null>(null);
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
        setTargetIP(data);
      } else {
        setError('Invalid IP address or lookup failed');
        setTargetIP(null);
      }
    } catch (err) {
      setError('Failed to fetch IP details. Please try again.');
      setTargetIP(null);
    } finally {
      setLoading(false);
    }
  };

  const distance =
    userIP && targetIP
      ? calculateDistance(
          userIP.latitude,
          userIP.longitude,
          targetIP.latitude,
          targetIP.longitude
        )
      : undefined;

  const direction =
    userIP && targetIP
      ? calculateBearing(
          userIP.latitude,
          userIP.longitude,
          targetIP.latitude,
          targetIP.longitude
        )
      : undefined;

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
            targetLocation={
              targetIP
                ? { lat: targetIP.latitude, lng: targetIP.longitude }
                : null
            }
            userCity={userIP?.city}
            targetCity={targetIP?.city}
          />
        </div>

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

          {targetIP && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                Target Location
              </h3>
              <IPDetailsCard
                details={targetIP}
                distance={distance}
                direction={direction}
              />
            </div>
          )}
        </div>

        {!targetIP && userIP && (
          <div className="text-center mt-8 p-8 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600">
              Enter an IP address above to compare locations and see the distance between them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
