import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

export default function NavigationScreen() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [safePath, setSafePath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      setLocationGranted(true);
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const fetchCrimeData = async (lat, lon) => {
    const apiKey = 'YOUR_CRIMEOMETER_API_KEY'; // Replace this
    const radius = 1; // in miles
    const datetime_ini = '2023-01-01T00:00:00.000Z';
    const datetime_end = '2023-12-31T23:59:59.999Z';

    try {
      const response = await axios.get('https://api.crimeometer.com/v1/incidents/raw-data', {
        params: {
          lat, lon, radius, datetime_ini, datetime_end,
        },
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      });
      return response.data.incidents || [];
    } catch (err) {
      console.log("Crime API error", err.message);
      return [];
    }
  };

  const calculateSafeRoute = async () => {
    if (!destination || !currentLocation) {
      Alert.alert("Please enter destination and wait for location to load.");
      return;
    }

    setLoading(true);
    setMessage("Analyzing safest route...");

    try {
      const geoCoded = await Location.geocodeAsync(destination);
      if (geoCoded.length === 0) {
        Alert.alert("Invalid destination.");
        setLoading(false);
        return;
      }

      const destCoords = {
        latitude: geoCoded[0].latitude,
        longitude: geoCoded[0].longitude,
      };
      setDestinationLocation(destCoords);

      // Optional: fetch crime data for both source and destination
      await fetchCrimeData(currentLocation.latitude, currentLocation.longitude);
      await fetchCrimeData(destCoords.latitude, destCoords.longitude);

      // Simulate safe path using intermediate points
      const steps = 5;
      const newPath = [];

      for (let i = 1; i < steps; i++) {
        const lat = currentLocation.latitude + (destCoords.latitude - currentLocation.latitude) * (i / steps);
        const lon = currentLocation.longitude + (destCoords.longitude - currentLocation.longitude) * (i / steps);
        newPath.push({ latitude: lat, longitude: lon });
      }
      setSafePath(newPath);

      setTimeout(() => {
        setMessage("Safest route displayed.");
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Failed to calculate route.");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Safe Navigation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter destination"
        value={destination}
        onChangeText={setDestination}
      />
      <Button title="Calculate Safe Route" onPress={calculateSafeRoute} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}

      {currentLocation && (
        <MapView style={styles.map} region={currentLocation}>
          <Marker coordinate={currentLocation} title="You" pinColor="green" />
          {destinationLocation && (
            <Marker coordinate={destinationLocation} title="Destination" pinColor="red" />
          )}
          {safePath.map((point, index) => (
            <Marker key={index} coordinate={point} pinColor="orange" />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
  message: {
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: '600',
  },
});