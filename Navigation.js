import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import VoiceDistressScreen from './screens/VoiceDistressScreen';
import NavigationScreen from './screens/NavigationScreen';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Emergency') iconName = 'alert-circle';
            else if (route.name === 'Voice') iconName = 'mic';
            else if (route.name === 'Navigation') iconName = 'navigate';
            else if (route.name === 'About') iconName = 'information-circle';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Emergency" component={EmergencyScreen} />
        <Tab.Screen name="Voice" component={VoiceDistressScreen} />
        <Tab.Screen name="Navigation" component={NavigationScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}