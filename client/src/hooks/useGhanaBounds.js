import { useMemo } from 'react';

const GHANA_BOUNDS = {
  minLat: 4.5,
  maxLat: 11.5,
  minLng: -3.5,
  maxLng: 1.5,
};

export default function useGhanaBounds() {
  return useMemo(
    () => ({
      ...GHANA_BOUNDS,
      isWithin: (lat, lng) =>
        lat >= GHANA_BOUNDS.minLat &&
        lat <= GHANA_BOUNDS.maxLat &&
        lng >= GHANA_BOUNDS.minLng &&
        lng <= GHANA_BOUNDS.maxLng,
    }),
    []
  );
}
