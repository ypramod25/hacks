import React from 'react';
import { WebView } from 'react-native-webview';

const htmlContent = `
  <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands"></script>
    </head>
    <body>
      <h2>Listening for 'help' or 'go'...</h2>
      <script>
        async function start() {
          const recognizer = speechCommands.create('BROWSER_FFT');
          await recognizer.ensureModelLoaded();

          recognizer.listen(result => {
            const scores = result.scores;
            const labels = recognizer.wordLabels();
            const highestScoreIndex = scores.indexOf(Math.max(...scores));
            const detectedWord = labels[highestScoreIndex];

            if (detectedWord === 'help' || detectedWord === 'go') {
              window.ReactNativeWebView.postMessage('DISTRESS_DETECTED');
            }
          }, {
            includeSpectrogram: false,
            probabilityThreshold: 0.75
          });
        }
        start();
      </script>
    </body>
  </html>
`;

export default function VoiceDistressWebView({ onDistress }) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={(event) => {
        if (event.nativeEvent.data === 'DISTRESS_DETECTED') {
          onDistress();
        }
      }}
    />
  );
}