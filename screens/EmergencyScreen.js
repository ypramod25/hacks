// screens/EmergencyScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { auth, db } from '../src/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function EmergencyScreen() {
  const [loading, setLoading] = useState(false);

  const sendEmergencySMS = async () => {
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return Alert.alert('Error', 'User not logged in');
    }

    try {
      // Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return Alert.alert('Permission denied', 'Cannot access location');
      }

      // Get current location with high accuracy
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Get emergency contacts from Firestore
      const contactRef = doc(db, 'users', uid);
      const contactSnap = await getDoc(contactRef);

      if (contactSnap.exists()) {
        const { emergencyContacts } = contactSnap.data();
        const numbers = emergencyContacts.filter(Boolean);

        const isAvailable = await SMS.isAvailableAsync();
        if (!isAvailable) {
          setLoading(false);
          return Alert.alert('SMS not available');
        }

        const message = `🚨 Emergency! I need help.\nHere is my live location:\n${mapLink}`;

        await SMS.sendSMSAsync(numbers, message);
        Alert.alert('SMS Sent', 'Emergency message sent successfully.');
      } else {
        Alert.alert('No emergency contacts found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={emergencyStyles.container}>
      <Text style={emergencyStyles.title}>Emergency Alert</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d9534f" />
      ) : (
        <Button title="Send Emergency SMS" onPress={sendEmergencySMS} color="#d9534f" />
      )}
    </View>
  );
}

const emergencyStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
});
