import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer, StyleSheet } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CleanTabBar } from 'react-navigation-tabbar-collection';
import { useFonts } from 'expo-font';
import ScreenInicio from "./screens/ScreenInicio";
import ScreenIniciarSesion from "./screens/ScreenIniciarSesion";
import ScreenCrearCuenta from "./screens/ScreenCrearCuenta";
import ScreenHome from "./screens/ScreenHome";
import ScreenCuenta from "./screens/ScreenCuenta";
import ScreenAgendar from "./screens/ScreenAgendar";
import { LogBox, View, Text } from 'react-native';

import { Appearance, useColorScheme } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function HomeTabs() {
  const colorScheme = useColorScheme()
  return (
    <Tab.Navigator
    screenOptions={{
      headerStyle: {
          backgroundColor: "#9BC1BC",
        },
        headerTintColor: colorScheme === "dark" ? "#ED6A5A" : "#ED6A5A",
        headerTitleStyle: {
          fontFamily: "Poppins SemiBold",
          fontSize: 20,
          color: "#5D576B",
        },
        headerTitleAlign: 'center',
    }}
      tabBar={(props) => <CleanTabBar {...props} />}
    >
      <Tab.Screen name="HomeScreen" component={ScreenHome}
        options={{
          headerShown: false,
          title: 'Home',
          icon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="home" color="#5D576B" size={30} />
          ),
          tabBarLabelStyle: {
            fontSize: 15
          },
          color: '#ED6A5A'
        }}
      />
      <Tab.Screen name="ScreenAgendar" component={ScreenAgendar}
        options={{
          title: 'Agendar Cita',
          icon: ({ color, focused, name, size }) => (
            <MaterialCommunityIcons name="plus-circle" color="#5D576B" size={30} />
          ),
          tabBarLabelStyle: {
            fontSize: 15
          },
          color: '#ED6A5A'
        }} />
      <Tab.Screen name="ScreenCuenta" component={ScreenCuenta}
        options={{
          title: 'Cuenta',

          icon: ({ color, focused, name, size }) => (
            <MaterialCommunityIcons name="account-settings" color="#5D576B" size={30} />
          ),
          tabBarLabelStyle: {
            fontSize: 15
          },
          color: '#ED6A5A'
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack() {
  const colorScheme = useColorScheme()
  if (process.env.NODE_ENV === 'debug') {
    setDebugLevel(1)
  }
  LogBox.ignoreLogs(["timer"]);
  return (

    <Stack.Navigator

      screenOptions={{
        ...TransitionPresets.ModalTransition,
        headerStyle: {
          backgroundColor: "#9BC1BC",
        },
        headerTintColor: colorScheme === "dark" ? "#ED6A5A" : "#ED6A5A",
        headerTitleStyle: {
          fontFamily: "Poppins SemiBold",
          fontSize: 20,
          color: "#5D576B",
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="ScreenInicio"
        component={ScreenInicio}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ScreenIniciarSesion"
        component={ScreenIniciarSesion}
        options={{ title: "Iniciar Sesión" }}
      />

      <Stack.Screen
        name="ScreenCrearCuenta"
        component={ScreenCrearCuenta}
        options={{ title: "Crear Cuenta" }}
      />
      <Stack.Screen
        name="ScreenHome"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins Regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins SemiBold': require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins Medium': require('./assets/fonts/Poppins/Poppins-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

