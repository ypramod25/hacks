import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/firebase';

// Screens
import EmergencyScreen from './screens/EmergencyScreen';
import VoiceDistressScreen from './screens/VoiceDistressScreen';
import NavigationScreen from './screens/NavigationScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    Notifications.setNotificationChannelAsync('emergency-alerts', {
      name: 'Emergency Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      sound: false,
    });

    return () => unsubscribe();
  }, []);

  const HeaderRight = ({ navigation }) => (
    <View style={styles.headerRight}>
      {!user ? (
        <>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await signOut(auth);
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.authText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  function MainTabs({ navigation }) {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerRight: () => <HeaderRight navigation={navigation} />,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Emergency') iconName = 'alert-circle';
            else if (route.name === 'Voice Distress') iconName = 'mic';
            else if (route.name === 'Navigation') iconName = 'map';
            else if (route.name === 'About') iconName = 'information-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Emergency" component={EmergencyScreen} />
        <Tab.Screen name="Voice Distress" component={VoiceDistressScreen} />
        <Tab.Screen name="Navigation" component={NavigationScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', gap: 10, paddingRight: 10 },
  authButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  authText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});