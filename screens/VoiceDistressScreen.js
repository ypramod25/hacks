import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Vibration, Linking } from 'react-native';

const VoiceDistressScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [distressDetected, setDistressDetected] = useState(false);

  useEffect(() => {
    startListening();
  }, []);

  const startListening = () => {
    setIsListening(true);
    console.log('Listening for distress...');

    // Simulate detection after 5 seconds
    setTimeout(() => {
      setIsListening(false);
      setDistressDetected(true);
      Vibration.vibrate(1000); // Vibrate for 1 second
      console.log('Distress detected!');

      // Open SMS app with pre-filled message
      Linking.openURL(
        'sms:1234567890?body=Distress%20detected%20via%20voice!%20Please%20help%20immediately!'
      );
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Distress Detection</Text>
      <Text style={styles.status}>
        {isListening
          ? 'Listening for distress...'
          : distressDetected
          ? '🚨 Distress detected!'
          : 'Click below to start again'}
      </Text>

      {!isListening && (
        <Button title="Start Listening Again" onPress={startListening} color="tomato" />
      )}
    </View>
  );
};

export default VoiceDistressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
});
