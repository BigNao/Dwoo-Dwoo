import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import useGps from '../hooks/useGps';
import useReverseGeocode from '../hooks/useReverseGeocode';
import useGhanaBounds from '../hooks/useGhanaBounds';

const GHANA_DEFAULT_CENTER = [7.9465, -1.0232];
const MIN_ZOOM_FOR_PLACEMENT = 13;
const GPS_DISTANCE_WARN_M = 500;

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function accuracyLabel(meters) {
  if (meters == null) return null;
  if (meters <= 10) return 'Excellent';
  if (meters <= 30) return 'Good';
  if (meters <= 80) return 'Moderate';
  return 'Poor';
}

function accuracyColor(meters) {
  if (meters == null) return '';
  if (meters <= 10) return 'text-secondary';
  if (meters <= 30) return 'text-accent-dark';
  if (meters <= 80) return 'text-amber-500';
  return 'text-danger';
}

function FlyToOnMount({ center, zoom }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (center && !done.current) {
      done.current = true;
      map.flyTo(center, zoom || 16, { duration: 1.2 });
    }
  }, []);
  return null;
}

function MapClickHandler({ onPlace, minZoom, onZoomTooLow }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      if (map.getZoom() < minZoom) {
        onZoomTooLow();
        return;
      }
      onPlace([e.latlng.lat, e.latlng.lng]);
    },
  });
  useEffect(() => { map.doubleClickZoom?.disable(); }, [map]);
  return null;
}

function DraggableMarker({ position, onChange }) {
  return (
    <Marker
      position={position}
      draggable
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onChange([lat, lng]);
        },
      }}
    />
  );
}

export default function LocationPicker({ position, setPosition, error, onConfirm }) {
  const gps = useGps();
  const { address, loading: geoLoading, reverseGeocode } = useReverseGeocode();
  const { isWithin } = useGhanaBounds();
  const [zoomTooLow, setZoomTooLow] = useState(false);
  const [distanceWarn, setDistanceWarn] = useState(null);
  const [outsideWarn, setOutsideWarn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const zoomTimer = useRef(null);

  useEffect(() => { gps.detectOnce(); }, []);

  const handlePlace = useCallback(
    (coords) => {
      setZoomTooLow(false);
      setDistanceWarn(null);
      setOutsideWarn(false);
      setConfirmed(false);
      setPosition(coords);
      reverseGeocode(coords[0], coords[1]);
    },
    [setPosition, reverseGeocode]
  );

  const handleZoomTooLow = useCallback(() => {
    setZoomTooLow(true);
    clearTimeout(zoomTimer.current);
    zoomTimer.current = setTimeout(() => setZoomTooLow(false), 3000);
  }, []);

  const handleConfirmClick = useCallback(() => {
    if (!position) return;
    const [lat, lng] = position;

    if (!isWithin(lat, lng)) {
      setOutsideWarn(true);
      return;
    }
    if (gps.position) {
      const dist = Math.round(haversineMeters(gps.position[0], gps.position[1], lat, lng));
      if (dist > GPS_DISTANCE_WARN_M) {
        setDistanceWarn(dist);
        return;
      }
    }
    setConfirmed(true);
    if (onConfirm) onConfirm(position);
  }, [position, gps.position, isWithin, onConfirm]);

  const handleReturnToGps = useCallback(() => {
    setDistanceWarn(null);
    if (gps.position) handlePlace(gps.position);
  }, [gps.position, handlePlace]);

  const handleDismissDistance = useCallback(() => {
    setDistanceWarn(null);
    setConfirmed(true);
    if (onConfirm) onConfirm(position);
  }, [position, onConfirm]);

  const handleConfirmOutside = useCallback(() => {
    setOutsideWarn(false);
    setConfirmed(true);
    if (onConfirm) onConfirm(position);
  }, [position, onConfirm]);

  const handleEdit = useCallback(() => {
    setConfirmed(false);
    setDistanceWarn(null);
    setOutsideWarn(false);
  }, []);

  if (confirmed && position) {
    const [lat, lng] = position;
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border dark:border-white/10 bg-card dark:bg-asphalt-light p-4 sm:p-5 space-y-3">
          <p className="text-sm font-semibold text-ink dark:text-white">Location Confirmed</p>

          <div className="font-mono text-xs text-muted dark:text-white/60 space-y-1">
            <p>Latitude: {lat.toFixed(6)}</p>
            <p>Longitude: {lng.toFixed(6)}</p>
          </div>

          {geoLoading ? (
            <p className="text-xs text-muted dark:text-white/40">Looking up address…</p>
          ) : address ? (
            <div className="text-xs text-muted dark:text-white/60 space-y-0.5">
              {address.suburb && <p>{address.suburb}</p>}
              {address.town && <p>{address.town}</p>}
              {address.region && <p>{address.region}</p>}
              {address.country && <p>{address.country}</p>}
              {address.display === 'Unknown location' && (
                <p className="italic">Unknown location</p>
              )}
            </div>
          ) : null}

          {gps.accuracy != null && (
            <p className={`text-xs font-medium ${accuracyColor(gps.accuracy)}`}>
              GPS accuracy: {accuracyLabel(gps.accuracy)} (&plusmn;{Math.round(gps.accuracy)} m)
              {gps.accuracy > 80 && (
                <span className="block font-normal text-muted dark:text-white/50">
                  Try moving outdoors or adjust the marker manually.
                </span>
              )}
            </p>
          )}

          <div className="h-32 sm:h-40 rounded-lg overflow-hidden border border-border dark:border-white/10">
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              keyboard={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={markerIcon} />
            </MapContainer>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-white/20 text-sm font-medium text-ink dark:text-white hover:bg-muted/20 dark:hover:bg-white/5 transition-colors"
            >
              Choose Again
            </button>
            <span className="flex-1" />
          </div>
        </div>
        {error && <p className="text-sm text-danger font-medium">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink dark:text-white">Incident location</label>
      </div>

      <div className="relative h-56 sm:h-72 w-full rounded-lg overflow-hidden border border-border dark:border-white/10">
        <MapContainer
          center={position || gps.position || GHANA_DEFAULT_CENTER}
          zoom={position ? 16 : gps.position ? 15 : 7}
          style={{ height: '100%', width: '100%' }}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!position && <FlyToOnMount center={gps.position || null} zoom={16} />}
          <MapClickHandler onPlace={handlePlace} minZoom={MIN_ZOOM_FOR_PLACEMENT} onZoomTooLow={handleZoomTooLow} />
          {position && <DraggableMarker position={position} onChange={handlePlace} />}
        </MapContainer>
      </div>

      {zoomTooLow && (
        <p className="text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse">
          Please zoom in further before selecting the incident location.
        </p>
      )}

      {position && !distanceWarn && !outsideWarn && (
        <div className="space-y-2">
          <p className="font-mono text-sm text-ink dark:text-white font-semibold">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
          {geoLoading && (
            <p className="text-xs text-muted dark:text-white/40">Looking up address…</p>
          )}
          {!geoLoading && address && address.display !== 'Unknown location' && (
            <div className="text-xs text-muted dark:text-white/60 space-y-0.5">
              {address.suburb && <p>{address.suburb}</p>}
              {address.town && <p>{address.town}</p>}
              {address.region && <p>{address.region}</p>}
            </div>
          )}
          <p className="text-xs text-muted dark:text-white/40">Drag the pin to fine-tune the exact spot.</p>
          <button
            type="button"
            onClick={handleConfirmClick}
            className="w-full px-4 py-2.5 rounded-lg bg-primary dark:bg-accent text-white dark:text-ink text-sm font-semibold hover:bg-primary-hover dark:hover:bg-accent-dark transition-colors"
          >
            Confirm Location
          </button>
        </div>
      )}

      {distanceWarn && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 p-3 space-y-2">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            The selected location is approximately {distanceWarn} metres from your GPS location.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReturnToGps}
              className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
            >
              Use GPS Location
            </button>
            <button
              type="button"
              onClick={handleDismissDistance}
              className="text-xs px-3 py-1.5 rounded-md border border-amber-300 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            >
              Keep Selected
            </button>
          </div>
        </div>
      )}

      {outsideWarn && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-2">
          <p className="text-xs text-danger font-medium">
            The selected location appears to be outside Ghana. Continue anyway?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmOutside}
              className="text-xs px-3 py-1.5 rounded-md bg-danger text-white font-medium hover:bg-danger-dark transition-colors"
            >
              Continue Anyway
            </button>
            <button
              type="button"
              onClick={() => setOutsideWarn(false)}
              className="text-xs px-3 py-1.5 rounded-md border border-danger/30 text-danger font-medium hover:bg-danger/10 transition-colors"
            >
              Choose Again
            </button>
          </div>
        </div>
      )}

      {!position && gps.locating && (
        <p className="text-xs text-muted dark:text-white/40">Detecting your location&hellip;</p>
      )}
      {!position && !gps.locating && gps.accuracy != null && (
        <p className={`text-xs font-medium ${accuracyColor(gps.accuracy)}`}>
          GPS accuracy: {accuracyLabel(gps.accuracy)} (&plusmn;{Math.round(gps.accuracy)} m)
          {gps.accuracy > 80 && (
            <span className="block font-normal text-muted dark:text-white/50">
              Try moving outdoors or adjust the marker manually.
            </span>
          )}
        </p>
      )}
      {!position && !gps.locating && gps.accuracy == null && (
        <p className="text-xs text-muted dark:text-white/40">
          Zoom into your area on the map, then tap to place the pin.
        </p>
      )}

      {error && <p className="text-sm text-danger font-medium">{error}</p>}
    </div>
  );
}
