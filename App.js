<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, LogBox } from 'react-native';
import * as Location from 'expo-location';
import Navigation from './Navigation'; // ✅ path is fine

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHasPermission(false);
          setErrorMsg('Permission to access location was denied');
        } else {
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
        setErrorMsg('Something went wrong while requesting permission.');
        setHasPermission(false);
      }
    })();

    LogBox.ignoreLogs(['Warning: ...']);
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Requesting location permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {errorMsg || 'Location permission is required to use this app.'}
        </Text>
      </View>
    );
  }

  return <Navigation />;
=======
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
>>>>>>> 413372d (Initial commit)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
=======
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
>>>>>>> 413372d (Initial commit)
  },
});
