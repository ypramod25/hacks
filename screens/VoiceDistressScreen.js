// screens/VoiceDistressScreen.js
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';

const VoiceDistressScreen = () => {
  const webviewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data.toLowerCase();
    console.log('Heard:', message);

    const distressKeywords = ['help', 'save', 'help me'];
    const detected = distressKeywords.some((word) => message.includes(word));

    if (detected) {
      // 1. Send SMS
      Linking.openURL('sms:9117847411?body=🚨 Voice distress detected! Please help immediately!');

      // 2. Trigger Notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Distress Detected!',
          body: 'Voice distress signal triggered. Emergency SMS sent.',
          sound: false, // No sound
          sticky: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
        channelId: 'emergency-alerts',
      });

      // 3. Optional Alert UI (visual feedback only)
      Alert.alert('🚨 Distress Detected', 'Emergency alert has been sent.');
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
          const transcript = event.results[event.results.length - 1][0].transcript;
          window.ReactNativeWebView.postMessage(transcript);
        };

        recognition.onerror = function(event) {
          console.error("Speech recognition error:", event.error);
        };

        recognition.start();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎙 Voice Distress Detection</Text>
      <Text style={styles.status}>
        Listening for "help", "save", "help me"... Emergency SMS will be sent silently.
      </Text>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        style={{ flex: 1, width: '100%' }}
      />
    </View>
  );
};

export default VoiceDistressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: 'gray',
  },
});