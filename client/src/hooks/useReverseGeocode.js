import { useCallback, useRef, useState } from 'react';

export default function useReverseGeocode() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastCoords = useRef(null);

  const reverseGeocode = useCallback(async (lat, lng) => {
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    if (lastCoords.current === key) return;
    lastCoords.current = key;

    setLoading(true);
    setAddress(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      if (data && data.display_name) {
        const a = data.address || {};
        setAddress({
          display: data.display_name,
          road: a.road || '',
          suburb: a.suburb || a.neighbourhood || '',
          town: a.town || a.city || a.municipality || '',
          region: a.state || a.region || '',
          country: a.country || '',
        });
      } else {
        setAddress({ display: 'Unknown location' });
      }
    } catch {
      setAddress({ display: 'Unknown location' });
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, reverseGeocode };
}
