import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../src/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Welcome!</Text>
      {profile && (
        <View style={homeStyles.profileBox}>
          <Text>Name: {profile.name}</Text>
          <Text>Phone: {profile.phone}</Text>
          <Text>Email: {profile.email}</Text>
        </View>
      )}
      <Button title="Go to Emergency" onPress={() => navigation.navigate('Emergency')} />
      <View style={{ marginTop: 10 }} />
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}

const homeStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  profileBox: { marginBottom: 20, alignItems: 'center' },
});
