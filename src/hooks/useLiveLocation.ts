import { useState, useEffect, useRef, useCallback } from 'react';
import { LiveLocation } from '../types/safety';

export type GeolocationStatus = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'simulated';

export interface UseLiveLocationReturn {
  location: LiveLocation | null;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  status: GeolocationStatus;
  error: string | null;
  isTracking: boolean;
  requestPermission: () => void;
  refreshLocation: () => void;
  setSimulatedCoords: (coords: { latitude: number; longitude: number; accuracy?: number }) => void;
}

// Default benchmark coordinate (Tech Campus / Metro Center)
const DEFAULT_LAT = 37.7749;
const DEFAULT_LNG = -122.4194;

export function useLiveLocation(): UseLiveLocationReturn {
  const [location, setLocation] = useState<LiveLocation>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    accuracy: 12,
    timestamp: Date.now(),
  });
  const [status, setStatus] = useState<GeolocationStatus>('prompt');
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);
  const manualOverrideRef = useRef<boolean>(false);

  const startTracking = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    // Clear existing watch if any
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    };

    try {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          if (!manualOverrideRef.current) {
            const newLoc: LiveLocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 8),
              timestamp: pos.timestamp || Date.now(),
            };
            setLocation(newLoc);
            setStatus('granted');
            setError(null);
          }
        },
        (err) => {
          console.warn('Geolocation watch error:', err.message);
          if (err.code === err.PERMISSION_DENIED) {
            setStatus('denied');
            setError('Location permission denied. Running in privacy-safe simulation mode.');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setStatus('unavailable');
            setError('Location position unavailable. Falling back to calibrated coordinates.');
          } else if (err.code === err.TIMEOUT) {
            // Non-fatal, retry or keep existing
            setError('Location request timed out. Retrying...');
          }
        },
        options
      );

      watchIdRef.current = id;
    } catch (e: any) {
      setStatus('unavailable');
      setError(e.message || 'Failed to start geolocation tracking');
    }
  }, []);

  const requestPermission = useCallback(() => {
    manualOverrideRef.current = false;
    startTracking();
  }, [startTracking]);

  const refreshLocation = useCallback(() => {
    manualOverrideRef.current = false;
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy || 8),
            timestamp: pos.timestamp || Date.now(),
          });
          setStatus('granted');
          setError(null);
        },
        (err) => {
          console.warn('Geolocation refresh error:', err.message);
          startTracking();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  }, [startTracking]);

  const setSimulatedCoords = useCallback(
    (coords: { latitude: number; longitude: number; accuracy?: number }) => {
      manualOverrideRef.current = true;
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy ?? 9,
        timestamp: Date.now(),
      });
      setStatus('simulated');
    },
    []
  );

  useEffect(() => {
    // Attempt tracking on mount
    startTracking();

    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [startTracking]);

  return {
    location,
    latitude: location?.latitude ?? DEFAULT_LAT,
    longitude: location?.longitude ?? DEFAULT_LNG,
    accuracy: location?.accuracy ?? 10,
    timestamp: location?.timestamp ?? Date.now(),
    status,
    error,
    isTracking,
    requestPermission,
    refreshLocation,
    setSimulatedCoords,
  };
}
