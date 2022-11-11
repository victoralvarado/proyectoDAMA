import React, { useState, useEffect } from "react";
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
import ScreenConfiguracion from "./screens/ScreenConfiguracion";
import LoginState from "./screens/LoginState";
import ScreenHorarios from "./screens/ScreenHorarios";
import ScreenCitas from "./screens/ScreenCitas";
import ScreenProductos from "./screens/ScreenProductos";
import ScreenEditarProducto from "./screens/ScreenEditarProducto";
import { LogBox, View, Text } from 'react-native';
import { Appearance, useColorScheme } from 'react-native';
import storage from './screens/Storage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const [user, setUser] = useState("");
  useEffect(() => {
    storage
      .load({
        key: 'loginState',

        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,

        // syncInBackground (default: true) means if data expired,
        // return the outdated data first while invoking the sync method.
        // If syncInBackground is set to false, and there is expired data,
        // it will wait for the new data and return only after the sync completed.
        // (This, of course, is slower)
        syncInBackground: true,

        // you can pass extra params to the sync method
        // see sync example below
        syncParams: {
          extraFetchOptions: {
            // blahblah
          },
          someFlag: true
        }
      })
      .then(ret => {
        // found data go to then()
        setUser(ret.nivel);
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        //console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });
  });
  const colorScheme = useColorScheme()
  if (user == 0) {
    return (
      <Tab.Navigator
        initialRouteName="HomeScreen"
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
            unmountOnBlur: true,
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
        <Tab.Screen name="ScreenConfiguracion" component={ScreenConfiguracion}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            title: 'Configuración',
            icon: ({ color, focused, name, size }) => (
              <MaterialCommunityIcons name="cog" color="#5D576B" size={30} />
            ),
            tabBarLabelStyle: {
              fontSize: 15
            },
            color: '#ED6A5A'
          }} />
        <Tab.Screen name="ScreenCuenta" component={ScreenCuenta}
          options={{
            unmountOnBlur: true,
            headerShown: false,
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
  } else if (user == 1) {
    return (
      <Tab.Navigator
        initialRouteName="HomeScreen"
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
            unmountOnBlur: true,
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
            unmountOnBlur: true,
            headerShown: false,
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
            unmountOnBlur: true,
            headerShown: false,
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

}


export default function App() {
  const colorScheme = useColorScheme()
  if (process.env.NODE_ENV === 'debug') {
    setDebugLevel(1)
  }
  LogBox.ignoreLogs(["timer"]);
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
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
      <Stack.Navigator
        initialRouteName="LoginState"
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
          /*headerTitleAlign: 'center',*/
        }}
      >
        <Stack.Screen
          name="LoginState"
          component={LoginState}
          options={{ headerShown: false }}
        />
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
          name="ScreenHorarios"
          component={ScreenHorarios}
          options={{ title: "Horarios" }}
        />
        <Stack.Screen
          name="ScreenCitas"
          component={ScreenCitas}
          options={{ title: "Citas" }}
        />
        <Stack.Screen
          name="ScreenProductos"
          component={ScreenProductos}
          options={{ title: "Productos" }}
        />
        <Stack.Screen
          name="ScreenEditarProducto"
          component={ScreenEditarProducto}
          options={{ title: "Editar Producto" }}
        />
        <Stack.Screen
          name="ScreenHome"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

