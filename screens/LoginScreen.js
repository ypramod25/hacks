import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      Alert.alert('Login Successful', 'Welcome back!');

      // Reset navigation stack and go to Home tab
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', state: { routes: [{ name: 'Home' }] } }],
      });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  buttonText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '600' },
  linkContainer: { marginTop: 10, alignItems: 'center' },
  link: { color: '#007bff', textDecorationLine: 'underline', fontSize: 14 },
});