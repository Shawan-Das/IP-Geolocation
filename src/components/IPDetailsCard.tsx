import { Globe, MapPin, Clock, Wifi, Building2 } from 'lucide-react';
import { IPDetails } from '../types';

interface IPDetailsCardProps {
  details: IPDetails;
  distance?: number;
  direction?: string;
}

export function IPDetailsCard({ details, distance, direction }: IPDetailsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{details.ip}</h2>
          <p className="text-gray-500 text-sm">{details.type}</p>
        </div>
        <div className="text-5xl">{details.flag.emoji}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{details.city}, {details.region}</p>
              <p className="text-sm text-gray-600">{details.country}</p>
              <p className="text-xs text-gray-500 mt-1">
                {details.latitude.toFixed(4)}, {details.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Postal Code</p>
              <p className="font-semibold text-gray-800">{details.postal || 'N/A'}</p>
            </div>
          </div>

          {distance !== undefined && direction && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Distance from You</p>
                <p className="font-semibold text-gray-800">
                  {distance.toFixed(2)} km
                </p>
                <p className="text-sm text-gray-600">Direction: {direction}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Wifi className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">ISP</p>
              <p className="font-semibold text-gray-800">{details.connection.isp}</p>
              <p className="text-sm text-gray-600">{details.connection.org}</p>
              <p className="text-xs text-gray-500 mt-1">ASN: {details.connection.asn}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Timezone</p>
              <p className="font-semibold text-gray-800">{details.timezone.id}</p>
              <p className="text-sm text-gray-600">UTC {details.timezone.utc}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(details.timezone.current_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Country Details</p>
              <p className="font-semibold text-gray-800">Capital: {details.capital}</p>
              <p className="text-sm text-gray-600">Code: {details.calling_code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
