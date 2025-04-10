import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');

  const handleRegister = async () => {
    if (!name || !phone || !email || !password || !contact1) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        name,
        phone,
        email,
        emergencyContacts: [contact1, contact2].filter(Boolean),
      });

      Alert.alert('Success', 'Registered successfully.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#666" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#666" keyboardType="phone-pad" onChangeText={setPhone} value={phone} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" keyboardType="email-address" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry onChangeText={setPassword} value={password} />

      <Text style={styles.subheading}>Emergency Contacts</Text>
      <TextInput style={styles.input} placeholder="Emergency Contact 1" placeholderTextColor="#666" keyboardType="phone-pad" onChangeText={setContact1} value={contact1} />
      <TextInput style={styles.input} placeholder="Emergency Contact 2 (optional)" placeholderTextColor="#666" keyboardType="phone-pad" onChangeText={setContact2} value={contact2} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f9f9f9', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  subheading: { fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  buttonText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '600' },
  linkContainer: { marginTop: 10, alignItems: 'center' },
  link: { color: '#007bff', textDecorationLine: 'underline', fontSize: 14 },
});