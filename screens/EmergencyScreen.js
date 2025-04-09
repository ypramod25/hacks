import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SMS from 'expo-sms';
import * as Haptics from 'expo-haptics';

export default function EmergencyScreen() {
  const sendEmergencySMS = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        ['1234567890'], // Replace with actual emergency contact
        '🚨 Emergency! I need help. This is my location: https://maps.google.com?q=28.6139,77.2090'
      );
    } else {
      Alert.alert('SMS not available on this device');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Alert</Text>
      <Button title="Send Emergency SMS" onPress={sendEmergencySMS} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
});
