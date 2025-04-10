import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as Speech from 'expo-speech';

const NavigationScreen = () => {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use navigation.');
      return;
    }

    setHasPermission(true);
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const calculateSafeRoute = () => {
    if (!destination) {
      Alert.alert('Missing Destination', 'Please enter a destination first.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const safePath = [
        location,
        { latitude: location.latitude + 0.001, longitude: location.longitude + 0.001 },
        { latitude: location.latitude + 0.002, longitude: location.longitude + 0.002 },
      ];
      setRoute(safePath);
      setLoading(false);
      Speech.speak('Safe route calculated. Follow the direction markers.');
    }, 2000);
  };

  if (!hasPermission || !location) {
    return (
      <View style={styles.centered}>
        <Text>Requesting location permission or fetching location...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={setDestination}
        />
        <Button title="Get Safe Route" onPress={calculateSafeRoute} />

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text>Calculating safest route...</Text>
          </View>
        )}

        {route.length > 0 && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {route.map((point, index) => (
              <Marker
                key={index}
                coordinate={point}
                title={index === 0 ? 'Start' : index === route.length - 1 ? 'Destination' : `Step ${index}`}
                pinColor={index === 0 ? 'green' : index === route.length - 1 ? 'red' : 'orange'}
              />
            ))}
          </MapView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
