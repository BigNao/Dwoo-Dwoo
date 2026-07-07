import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function NearbyIncidentsMap({ incidents = [], center = [5.6037, -0.1870], zoom = 13 }) {
  const [userLocation, setUserLocation] = useState(center);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('Unable to get user location');
        }
      );
    }
  }, []);

  const verifiedIncidents = incidents.filter((i) => i.status === 'verified' && i.location);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Nearby Incidents</h3>
        <p className="text-sm text-muted">{verifiedIncidents.length} verified reports nearby</p>
      </div>
      <div className="h-64">
        <MapContainer center={userLocation} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapView center={userLocation} zoom={zoom} />
          
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {verifiedIncidents.map((incident) => (
            <Marker
              key={incident.report_id}
              position={[incident.location.latitude, incident.location.longitude]}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">{incident.incident_type}</p>
                  <p className="text-muted">{incident.reference_number}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
