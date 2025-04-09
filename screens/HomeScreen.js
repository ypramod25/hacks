// screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SafeRouteApp 🚨</Text>
      <Text style={styles.text}>
        This app is designed to ensure the safety of women by providing:
        {"\n\n"}• Emergency SMS Alerts
        {"\n"}• Voice Distress Detection
        {"\n"}• Safe Route Navigation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
