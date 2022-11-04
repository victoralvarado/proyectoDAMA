import React, { useState, useEffect } from "react";
import { Button, StyleSheet, SafeAreaView, DevSettings, ScrollView, StatusBar, View, Text, Dimensions, Image, Pressable } from "react-native";
import { NativeBaseProvider, Center, extendTheme, FormControl, Input, Slide, Box, CheckIcon, HStack, Spinner } from "native-base";
import { ListItem, Avatar } from "react-native-elements";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {firebase} from "../database/firebase";
import storage from './Storage';
export default function ScreenCuenta(props) {
    const isFocused = useIsFocused();
    const [user, setUser] = useState(null);
    const [datos, setDatos] = useState([]);
    const theme = extendTheme({
        colors: {
            primary: {
                1: '#5D576B',
                2: '#9BC1BC',
                3: '#ED6A5A',
                4: '#E6EBE0',
                5: '#F4F1BB',
            },
        },
        config: {
            // Changing initialColorMode to 'dark'
            initialColorMode: 'light'
        }
    });
    const cs = () => {
        storage.remove({
            key: 'loginState'
        });
        props.navigation.navigate("LoginState")
    };
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
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
                    const datos = [];
                    datos.push(ret);
                    setDatos(datos);
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
            // Call any action
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);
    if (user == null) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={styles.scrollView}>
                    <NativeBaseProvider theme={theme}>
                        <Center flex={1}>
                            <Spinner size="lg" />
                        </Center>
                    </NativeBaseProvider>
                </ScrollView>
            </SafeAreaView>
        );
    }else if (user == 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Cuenta</Text>
                <Text>{user}</Text>
                <Button
                    onPress={cs}
                    title="Cerrar Sesión"
                    color="#841584"
                />
            </SafeAreaView>
        );
    } else if (user == 1) {
        return (
            <SafeAreaView style={{ paddingTop: StatusBar.currentHeight, }}>
                <ScrollView style={styles.scrollView}>
                    <NativeBaseProvider theme={theme} >
                        <Center flex={1}>
                            <View>
                                <Text style={styles.text}>Cuenta</Text>
                            </View>
                            <Box w="90%" bg="primary.5" p="5" rounded="2xl" _text={{
                                fontSize: 'md',
                                fontWeight: 'medium',
                                color: 'warmGray.50',
                                textAlign: 'center'
                            }}>
                                <Pressable onPress={() => alert('Edit')}>
                                    <Text style={{ alignSelf: 'flex-end' }}>
                                        <MaterialCommunityIcons name="account-edit" color="#5D576B" size={30} />
                                    </Text>
                                </Pressable>

                                {datos.map((d) => {
                                    return (
                                        <ListItem
                                            key={d.id}
                                            containerStyle={{ padding: 0 }}
                                        >
                                            <ListItem.Content style={{ backgroundColor: "#F4F1BB", color: "#5D576B", alignItems: 'center' }}>
                                                <ListItem.Title style={{ backgroundColor: "#F4F1BB", color: "#5D576B", fontSize: 25, fontFamily: "Poppins Bold" }}>{d.nombre + " " + d.apellido}</ListItem.Title>
                                                <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.correo}</ListItem.Subtitle>
                                                <ListItem.Subtitle style={{ backgroundColor: "#F4F1BB", color: "#5D576B" }}>{d.telefono}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>
                                    );
                                })}

                            </Box>
                            <View style={{ alignItems: 'flex-start', width: '90%', marginTop: 5, backgroundColor: "#E6EBE0" }}>
                                <Pressable onPress={() => props.navigation.navigate("ScreenCitas")} style={{}}>
                                    <HStack space={2}>
                                        <MaterialCommunityIcons style={{ marginRight: 20 }} name="calendar" color="#5D576B" size={40} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins SemiBold", paddingTop: 5 }}>
                                                Citas
                                            </Text>
                                        </View>
                                    </HStack>
                                </Pressable>
                            </View>
                            <View style={{ alignItems: 'flex-start', width: '90%', marginTop: 5, backgroundColor: "#FFA78C" }}>
                                <Pressable onPress={cs} style={{}}>
                                    <HStack space={2}>
                                        <MaterialCommunityIcons style={{ marginRight: 20 }} name="logout" color="#5D576B" size={40} />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: "#5D576B", fontSize: 15, fontFamily: "Poppins SemiBold", paddingTop: 5 }}>
                                                Cerrar Sesión
                                            </Text>
                                        </View>
                                    </HStack>
                                </Pressable>
                            </View>
                        </Center>
                    </NativeBaseProvider>
                </ScrollView>
            </SafeAreaView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#FFF"
    },
    scrollView: {
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    text: {
        textAlign: 'center',
        fontFamily: "Poppins Bold",
        color: "#ED6A5A",
        fontSize: 35
    },
    img: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
});