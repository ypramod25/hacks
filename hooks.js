// utils/useLocationPermission.js
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useLocationPermission() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return hasPermission;
}
