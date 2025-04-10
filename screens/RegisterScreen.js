// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
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

      Alert.alert('Success', 'Registered and details saved.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={registerStyles.container}>
      <Text style={registerStyles.title}>Register Account</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="Full Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Text style={registerStyles.subheading}>Emergency Contacts</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="Emergency Contact 1"
        keyboardType="phone-pad"
        onChangeText={setContact1}
        value={contact1}
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Emergency Contact 2 (optional)"
        keyboardType="phone-pad"
        onChangeText={setContact2}
        value={contact2}
      />
      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
}

const registerStyles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subheading: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
});
