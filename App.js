import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ScreenInicio from "./screens/ScreenInicio";
import ScreenIniciarSesion from "./screens/ScreenIniciarSesion";
import ScreenCrearCuenta from "./screens/ScreenCrearCuenta";
import ScreenHome from "./screens/ScreenHome";
import { LogBox } from 'react-native';

import { Appearance, useColorScheme } from 'react-native';



const Stack = createStackNavigator();
function MyStack() {
  const colorScheme = useColorScheme()

  if (process.env.NODE_ENV === 'debug') {
    setDebugLevel(1)
  }
  LogBox.ignoreLogs(["timer"]);
  return (

    <Stack.Navigator

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
      {/*
      <Stack.Screen
        name="ScreenHome"
        component={ScreenHome}
        options={{ title: "Home" }}
      /> */}
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
}