// screens/AboutScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About SafeRouteApp 🛡️</Text>
      <Text style={styles.text}>
        SafeRouteApp was built during HackMol 6.0 to support women’s safety in public spaces.
        {"\n\n"}Created with ❤️ by a passionate team using React Native + Expo.
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
