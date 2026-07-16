import { useCallback, useRef, useState } from 'react';

export default function useGps() {
  const [gpsState, setGpsState] = useState({
    locating: false,
    position: null,
    accuracy: null,
    error: null,
  });
  const attemptedRef = useRef(false);

  const detectGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsState((s) => ({ ...s, locating: false, error: "Geolocation isn't supported on this device." }));
      return;
    }

    setGpsState((s) => ({ ...s, locating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsState({
          locating: false,
          position: [pos.coords.latitude, pos.coords.longitude],
          accuracy: pos.coords.accuracy,
          error: null,
        });
      },
      () => {
        setGpsState((s) => ({
          ...s,
          locating: false,
          error: "Couldn't detect your location. Zoom into your area on the map and tap to drop a pin instead.",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const detectOnce = useCallback(() => {
    if (!attemptedRef.current) {
      attemptedRef.current = true;
      detectGps();
    }
  }, [detectGps]);

  const clearGps = useCallback(() => {
    attemptedRef.current = false;
    setGpsState({ locating: false, position: null, accuracy: null, error: null });
  }, []);

  return { ...gpsState, detectGps, detectOnce, clearGps };
}
